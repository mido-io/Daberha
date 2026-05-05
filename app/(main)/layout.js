import Header from '@/components/Header'
import { checkUser } from '@/lib/checkUser'
import React from 'react'

const MainLayout = async ({ children }) => {
    // Ensure the user exists in our database before accessing main routes
    await checkUser();

    return (
        <div>
            <Header />

            <main>
                {children}
            </main>
        </div>
    )
}

export default MainLayout