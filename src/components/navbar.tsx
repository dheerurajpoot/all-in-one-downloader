"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Download } from "lucide-react";
import { SITE_NAME } from "@/lib/constant";

export function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	const navItems = [
		{ label: "Home", href: "/" },
		{ label: "About", href: "/about" },
		{ label: "Contact", href: "/contact" },
		{ label: "Terms", href: "/terms" },
		{ label: "Privacy", href: "/privacy" },
		{ label: "Disclaimer", href: "/disclaimer" },
	];

	return (
		<nav className='sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
			<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='flex h-16 items-center justify-between'>
					{/* Logo */}
					<Link href='/' className='flex items-center gap-2'>
						<div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary'>
							<Download className='h-6 w-6 text-primary-foreground' />
						</div>
						<span className='hidden text-xl font-bold text-foreground sm:inline'>
							{SITE_NAME}
						</span>
					</Link>

					{/* Desktop Menu */}
					<div className='hidden md:flex items-center gap-8'>
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className='text-sm font-medium text-foreground transition-colors hover:text-primary'>
								{item.label}
							</Link>
						))}
					</div>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setIsOpen(!isOpen)}
						className='md:hidden inline-flex items-center justify-center p-2 rounded-lg text-foreground hover:bg-muted'>
						{isOpen ? (
							<X className='h-6 w-6' />
						) : (
							<Menu className='h-6 w-6' />
						)}
					</button>
				</div>

				{/* Mobile Menu */}
				{isOpen && (
					<div className='md:hidden border-t border-border'>
						<div className='flex flex-col gap-2 py-4'>
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className='block px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted rounded-lg'
									onClick={() => setIsOpen(false)}>
									{item.label}
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
