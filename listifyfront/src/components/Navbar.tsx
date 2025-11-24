"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CheckSquare, Clock, Flame, Share2, Settings } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Navbar() {
  const pathname = usePathname();
  const { gameData, tasks } = useApp();
  
  const pendingTasks = tasks.filter(t => !t.done).length;
  const xpPercentage = (gameData.xp / gameData.xpToNextLevel) * 100;

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { href: "/", icon: Home, label: "Inicio" },
    { href: "/tasks", icon: CheckSquare, label: "Tareas", badge: pendingTasks },
    { href: "/history", icon: Clock, label: "Historial" },
    { href: "/pet", icon: Flame, label: "Mascota" },
    { href: "/social", icon: Share2, label: "Social" },
  ];

  return (
    <nav style={{
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Logo y nivel */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link href="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          textDecoration: 'none'
        }}>
          <CheckSquare color="#f97316" size={28} />
          <h1 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: '#1f2937',
            margin: 0
          }}>
            Listify
          </h1>
        </Link>

        {/* Barra de nivel */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          backgroundColor: '#f9fafb',
          padding: '8px 16px',
          borderRadius: '20px'
        }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
            Nivel {gameData.level}
          </span>
          <div style={{ 
            width: '120px', 
            height: '6px', 
            backgroundColor: '#e5e7eb', 
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${xpPercentage}%`, 
              height: '100%', 
              backgroundColor: '#f97316',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>
            {gameData.xp}/{gameData.xpToNextLevel}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Flame size={16} color="#f97316" />
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#f97316' }}>
              {gameData.streak}
            </span>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link 
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: active ? '#fef2f2' : 'transparent',
                color: active ? '#ef4444' : '#6b7280',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: active ? '600' : '500',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '2px 6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  minWidth: '18px',
                  textAlign: 'center'
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Usuario */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link href="/settings" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#6b7280',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f9fafb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}>
            <Settings size={20} />
          </button>
        </Link>
        
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#374151',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          N
        </div>
      </div>
    </nav>
  );
}