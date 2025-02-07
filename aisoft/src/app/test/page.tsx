import React from 'react'

export default async function page() {
    const res = await fetch("http://localhost:3000/api/test/user",{
        method: "PUT"
    })
    const data = await res.json()
    console.log(data)
    return (
        <div>page</div>
    )
}
