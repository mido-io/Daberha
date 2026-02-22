import Header from '@/components/Header'
import React from 'react'

const layout = ({ children }) => {
    return (
        <div>
            <Header />

            <main>
                {children}
            </main>
        </div>
    )
}

export default layout