"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { User, LogIn, UserPlus } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface AuthSectionProps {
  onDrawerClose: () => void
}

export function AuthSection({ onDrawerClose }: AuthSectionProps) {
  const { user, isLoggedIn, logout } = useAuth()

  const handleLogin = () => {
    // For demo purposes, simulate login with mock data
    // In a real app, this would open a login modal or redirect to login page
    console.log("Login clicked")
    onDrawerClose()
  }


  const handleLogout = () => {
    logout()
    onDrawerClose()
  }

  if (isLoggedIn && user) {
    return (
      <div className="flex items-center justify-between p-3 glass-option rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-purple-400/20 flex items-center justify-center">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <User className="h-4 w-4 text-purple-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-xs hover:bg-red-400/20 hover:text-red-400"
        >
          Logout
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center space-x-2 p-3">
        <div className="w-8 h-8 rounded-full bg-purple-400/20 flex items-center justify-center">
          <User className="h-4 w-4 text-purple-400" />
        </div>
        <span className="text-sm text-foreground">Not signed in</span>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogin}
          className="flex-1 glass-button border-purple-400/30 hover:border-purple-400/50 hover:bg-purple-400/10"
        >
          <LogIn className="h-3 w-3 mr-1" />
          Login
        </Button>

      </div>
    </div>
  )
}
