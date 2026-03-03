import React, { useState } from 'react'
import Breadcrumb from '../../basicComponents/BreadCrumb'
import MenuMappingMain from '../components/MenuMappingMain'

function MenuMappingEntry() {
    const [isLoading, setIsLoading] = useState({
        normal: false,
        spinner: false
    })
    return (
        <>
            <Breadcrumb
                items={[{ label: 'Menu Mapping' }]}
                title="Menu Mapping"
                description="Configure menu access based on role, designation, or employee"
            />

            <MenuMappingMain isLoading={isLoading} setIsLoading={setIsLoading} />
        </>
    )
}

export default MenuMappingEntry