# Backend Express API Reference for Multi-Tenant Payroll Module

This directory contains the production-ready Node.js / Express backend code for the **Payroll Run & Multi-Tenant Engine**.

## File Structure & Where to Copy:

Copy these files into your backend project at `D:\projects\PPP\BACKEND\EXPRESS\pppapi`:

| Reference File | Destination in Backend (`D:\projects\PPP\BACKEND\EXPRESS\pppapi`) | Purpose |
|---|---|---|
| `middleware/tenantResolver.js` | `middleware/tenantResolver.js` | Intercepts requests, decodes company_code, and dynamically connects to the Client Database pool from Admin DB. |
| `routes/payrollRoutes.js` | `routes/payrollRoutes.js` | Configures `/api/payroll` endpoints. |
| `controllers/payrollController.js` | `controllers/payrollController.js` | Request/Response handlers. |
| `services/payrollService.js` | `services/payrollService.js` | Business logic for LOP, OT, Statutory deductions, and batch DB transactions. |
| `services/autoPayrollScheduler.js` | `services/autoPayrollScheduler.js` | Background cron job for daily automated payroll execution. |

---

## Setup Steps in Express `app.js` / `server.js`:

1. **Register the Router:**
```javascript
const payrollRoutes = require('./routes/payrollRoutes');
app.use('/api/payroll', payrollRoutes);
```

2. **Initialize Automated Scheduler:**
```javascript
const { initAutoPayrollScheduler } = require('./services/autoPayrollScheduler');

// Start cron worker when Express server starts
initAutoPayrollScheduler();
```

---

## Required Database Schema (Execute in Tenant DB):

```sql
-- 1. Payroll Settings Table
CREATE TABLE IF NOT EXISTS payroll_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auto_run_enabled TINYINT(1) DEFAULT 1,
    scheduled_day INT DEFAULT 28,
    cutoff_day INT DEFAULT 25,
    default_pay_period VARCHAR(50) DEFAULT 'monthly'
);

-- 2. Payroll Runs Summary Header
CREATE TABLE IF NOT EXISTS payroll_runs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    run_id VARCHAR(50) UNIQUE NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    total_employees INT NOT NULL,
    total_gross DECIMAL(12,2) NOT NULL,
    total_deductions DECIMAL(12,2) NOT NULL,
    total_net DECIMAL(12,2) NOT NULL,
    payment_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'COMPLETED',
    processed_by VARCHAR(100),
    processed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Itemized Payslips / Run Details
CREATE TABLE IF NOT EXISTS payroll_run_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    run_id VARCHAR(50) NOT NULL,
    emp_id VARCHAR(50) NOT NULL,
    working_days INT DEFAULT 30,
    present_days INT DEFAULT 30,
    lop_days INT DEFAULT 0,
    gross_salary DECIMAL(12,2) NOT NULL,
    lop_deduction DECIMAL(12,2) DEFAULT 0,
    overtime_pay DECIMAL(12,2) DEFAULT 0,
    pf_deduction DECIMAL(12,2) DEFAULT 0,
    esi_deduction DECIMAL(12,2) DEFAULT 0,
    pt_deduction DECIMAL(12,2) DEFAULT 0,
    tds_deduction DECIMAL(12,2) DEFAULT 0,
    advance_deduction DECIMAL(12,2) DEFAULT 0,
    total_deductions DECIMAL(12,2) NOT NULL,
    net_pay DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PROCESSED',
    FOREIGN KEY (run_id) REFERENCES payroll_runs(run_id) ON DELETE CASCADE
);
```
