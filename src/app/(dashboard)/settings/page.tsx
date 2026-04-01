import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { UserCircle, Shield, CreditCard, LogOut, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
  const session = await auth();
  await connectToDatabase();

  const user = await User.findOne({ email: session?.user?.email }).lean();

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.8rem", color: "#F5EDD8", marginBottom: ".3rem", display: "flex", alignItems: "center", gap: ".75rem" }}>
          <SettingsIcon size={24} color="#E87213" />
          Settings
        </h1>
        <p style={{ color: "#7A7E96", fontSize: ".85rem", letterSpacing: ".03em" }}>
          Manage your account preferences, subscription, and profile.
        </p>
      </div>

      <div style={{ display: "grid", gap: "1.5rem" }}>
        {/* Profile Section */}
        <div style={{
          background: "#0B162E",
          border: "1px solid #152142",
          borderLeft: "3px solid #E87213",
          padding: "2rem",
        }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", color: "#C8BDA4", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
            <UserCircle size={18} /> Profile Information
          </h2>
          
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <div style={{
              width: "80px", 
              height: "80px", 
              borderRadius: "50%", 
              background: "#152142",
              backgroundImage: user?.image ? `url(${user.image})` : "none",
              backgroundSize: "cover",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontFamily: "var(--font-serif)",
              color: "#E87213"
            }}>
              {!user?.image && session?.user?.name?.charAt(0)}
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", flex: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "1rem", alignItems: "center" }}>
                <span style={{ color: "#7A7E96", fontSize: ".8rem", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: ".05em" }}>Full Name</span>
                <span style={{ color: "#F5EDD8", fontSize: ".9rem" }}>{user?.name}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "1rem", alignItems: "center" }}>
                <span style={{ color: "#7A7E96", fontSize: ".8rem", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: ".05em" }}>Email Address</span>
                <span style={{ color: "#F5EDD8", fontSize: ".9rem" }}>{user?.email}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "1rem", alignItems: "center" }}>
                <span style={{ color: "#7A7E96", fontSize: ".8rem", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: ".05em" }}>Preferred Language</span>
                <span style={{ color: "#00B896", fontSize: ".9rem", background: "rgba(0,184,150,.1)", padding: ".2rem .5rem", display: "inline-block", width: "fit-content", border: "1px solid rgba(0,184,150,.3)" }}>
                  {user?.preferredLanguage === "hi" ? "Hindi (हिंदी)" : "English"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Section */}
        <div style={{
          background: "#0B162E",
          border: "1px solid #152142",
          borderLeft: "3px solid #00B896",
          padding: "2rem",
        }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", color: "#C8BDA4", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
            <Shield size={18} /> Plan & Usage
          </h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "1rem", alignItems: "center" }}>
              <span style={{ color: "#7A7E96", fontSize: ".8rem", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: ".05em" }}>Current Plan</span>
              <span style={{ color: "#F5EDD8", fontSize: "1.1rem", fontFamily: "var(--font-serif)" }}>
                {user?.subscription === "free" ? "Muft (Free Tier)" : user?.subscription === "pro" ? "Advocate Pro" : "Chamber Plan"}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "1rem", alignItems: "center" }}>
              <span style={{ color: "#7A7E96", fontSize: ".8rem", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: ".05em" }}>Documents Used</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".3rem", fontSize: ".8rem", color: "#C8BDA4" }}>
                  <span>{user?.documentsUsed || 0} Analyzed</span>
                  <span>{user?.documentsLimit === Infinity ? "Unlimited" : (user?.documentsLimit || 3) + " Total"}</span>
                </div>
                {/* Progress bar */}
                <div style={{ width: "100%", height: "4px", background: "#1C2D54", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ 
                    height: "100%", 
                    background: "#00B896", 
                    width: user?.documentsLimit ? `${Math.min(100, ((user.documentsUsed || 0) / user.documentsLimit) * 100)}%` : "0%"
                  }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #152142" }}>
             <Link href="/pricing" style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".5rem",
                background: "transparent",
                border: "1px solid #E87213",
                color: "#E87213",
                padding: ".6rem 1.5rem",
                fontFamily: "var(--font-sans)",
                fontSize: ".8rem",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                cursor: "pointer",
                textDecoration: "none"
              }}>
                <CreditCard size={14} /> Upgrade Plan
              </Link>
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{
          background: "transparent",
          border: "1px solid #D94F4F",
          borderLeft: "3px solid #D94F4F",
          padding: "2rem",
          marginTop: "1rem"
        }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", color: "#D94F4F", marginBottom: ".5rem", display: "flex", alignItems: "center", gap: ".5rem" }}>
            Danger Zone
          </h2>
          <p style={{ color: "#7A7E96", fontSize: ".8rem", marginBottom: "1.5rem" }}>
            If you log out, you will need to sign back in with your Google account.
          </p>
          <Link href="/api/auth/signout" prefetch={false} style={{
            display: "inline-flex",
            alignItems: "center",
            gap: ".5rem",
            background: "rgba(217, 79, 79, 0.1)",
            border: "1px solid #D94F4F",
            color: "#D94F4F",
            padding: ".6rem 1.5rem",
            fontFamily: "var(--font-sans)",
            fontSize: ".8rem",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: ".08em",
            cursor: "pointer",
            textDecoration: "none"
          }}>
            <LogOut size={14} /> Sign Out
          </Link>
        </div>
      </div>
    </div>
  );
}
