import React from "react";
import {motion} from 'framer-motion'


export default function NavigationBar(){
    return(
        <div>
            <nav className="top-0 left-0 w-full p-4 bg-blue-900 shadow-lg flex justify-between items-center px-10">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <img src="../src/assets/logo_white_landscape.png" alt="logo" className="h-10" />
                </motion.div>
                <ul className="flex space-x-6">
                {['Home', 'About', 'Services', 'Contact'].map((item, index) => (
                    <motion.li key={index} whileHover={{ scale: 1.1 }} className="cursor-pointer text-lg text-white hover:text-blue-400">
                    {item}
                    </motion.li>
                ))}
                </ul>
            </nav>
        </div>
    )
}