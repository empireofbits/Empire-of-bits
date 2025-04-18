'use client';

import type { ReactNode } from "react"
import { WalletButton } from "../solana-provider"
import { ClusterUiSelect } from "../cluster-ui"

interface UiLayoutProps {
  children: ReactNode
  links: { label: string; path: string }[]
}

export function UiLayout({ children, links }: UiLayoutProps) {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="navbar bg-base-300">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              {links.map((link) => (
                <li key={link.label}>
                  <a href={link.path}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <a className="btn btn-ghost normal-case text-xl" href="/">
            Solana dApp
          </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.path}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="navbar-end gap-2">
          <ClusterUiSelect />
          <WalletButton />
        </div>
      </div>
      <main className="container mx-auto py-10">{children}</main>
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <div>
          <p>Copyright © {new Date().getFullYear()} - Solana dApp</p>
        </div>
      </footer>
    </div>
  )
}

interface AppHeroProps {
  title: string
  subtitle: string
  children?: ReactNode
}

export function AppHero({ title, subtitle, children }: AppHeroProps) {
  return (
    <div className="hero bg-base-200 rounded-box">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">{title}</h1>
          <p className="py-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}
