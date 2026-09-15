const mysql = require('mysql2/promise');

// In-memory pool cache to avoid recreating connection pools on every request
const tenantPoolCache = new Map();

/**
 * Admin DB Pool - Used to fetch Client Database connection credentials
 */
const adminDbPool = mysql.createPool({
    host: process.env.ADMIN_DB_HOST || 'localhost',
    user: process.env.ADMIN_DB_USER || 'root',
    password: process.env.ADMIN_DB_PASSWORD || '',
    database: process.env.ADMIN_DB_NAME || 'ppp_admin_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

/**
 * Tenant Resolver Middleware
 * 1. Reads company_code / tenant_id from req.user (populated by JWT auth middleware)
 * 2. Fetches client DB credentials from Admin DB
 * 3. Retrieves or creates an isolated tenant DB connection pool
 * 4. Attaches req.tenantDb for downstream controller execution
 */
async function tenantResolver(req, res, next) {
    try {
        const companyCode = req.user?.company_code || req.headers['x-company-code'];

        if (!companyCode) {
            return res.status(400).json({
                success: false,
                message: 'Tenant Context Missing: Company code is required in token or x-company-code header.'
            });
        }

        // Check if pool is already cached for this company
        if (tenantPoolCache.has(companyCode)) {
            req.tenantDb = tenantPoolCache.get(companyCode);
            req.companyCode = companyCode;
            return next();
        }

        // Fetch client connection credentials from Admin DB
        const [rows] = await adminDbPool.query(
            'SELECT company_id, db_host, db_port, db_name, db_user, db_password FROM tenant_databases WHERE company_code = ? AND status = "ACTIVE"',
            [companyCode]
        );

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Client Database credentials not found for company code: ${companyCode}`
            });
        }

        const clientDbConfig = rows[0];

        // Create new isolated pool for this tenant
        const clientPool = mysql.createPool({
            host: clientDbConfig.db_host,
            port: clientDbConfig.db_port || 3306,
            user: clientDbConfig.db_user,
            password: clientDbConfig.db_password,
            database: clientDbConfig.db_name,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Cache the pool
        tenantPoolCache.set(companyCode, clientPool);

        req.tenantDb = clientPool;
        req.companyCode = companyCode;
        req.companyId = clientDbConfig.company_id;

        next();
    } catch (error) {
        console.error('TenantResolver Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to establish connection to Client Database.',
            error: error.message
        });
    }
}

module.exports = {
    tenantResolver,
    adminDbPool,
    tenantPoolCache
};
