"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type User = {
  name: string;
  email: string;
  role: "admin" | "user";
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // เพิ่ม Loading State
  const [menuOpen, setMenuOpen] = useState(false);

  // 1. โหลดข้อมูล User และจัดการ Loading
  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (!ignore) setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        if (!ignore) setIsLoading(false); // โหลดเสร็จแล้ว
      }
    }

    loadUser();

    return () => {
      ignore = true;
    };
  }, [pathname]);

  // 2. ปิดเมนูมือถืออัตโนมัติเมื่อเปลี่ยนหน้า (UX Improvement)
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // 3. รับฟัง Custom Event สำหรับ Auth
  useEffect(() => {
    function handleAuthChange(event: Event) {
      const authEvent = event as CustomEvent<{ user: User | null }>;
      setUser(authEvent.detail?.user ?? null);
    }

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.dispatchEvent(
      new CustomEvent("auth-change", { detail: { user: null } })
    );
    router.push("/login");
    router.refresh();
  }

  return