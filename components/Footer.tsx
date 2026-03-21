import Link from "next/link";
import { Logo } from "./Logo";
import { ExternalLink } from "lucide-react";

const FOOTER_LINKS = {
  Product: [
    { label: "Playground", href: "/playground" },
    { label: "The Brevit Standard", href: "/standard" },
    { label: "Benchmarks", href: "/#benchmarks" },
    { label: "Changelog", href: "/#changelog" },
  ],
  Documentation: [
    { label: "Getting Started", href: "/docs/javascript" },
    { label: "JavaScript SDK", href: "/docs/javascript" },
    { label: "Python SDK", href: "/docs/python" },
    { label: ".NET SDK", href: "/docs/dotnet" },
    { label: "API Reference", href: "/api-reference" },
  ],
  Packages: [
    { label: "npm — brevit", href: "https://www.npmjs.com/package/brevit", external: true },
    { label: "PyPI — brevit", href: "https://pypi.org/project/brevit/", external: true },
    { label: "NuGet — Brevit", href: "https://www.nuget.org/packages/Brevit", external: true },
    { label: "GitHub", href: "https://github.com/JavianDev", external: true },
  ],
};

export function Footer() {
  return (
    <footer
      className="relative mt-24 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Logo size={30} showWordmark />
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Compress data before sending to LLMs. Save 40–60% on tokens without losing meaning.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {["npm", "PyPI", "NuGet"].map((badge) => (
                <span
                  key={badge}
                  className="text-xs px-2 py-0.5 rounded-full font-mono"
                  style={{
                    background: "rgba(126,248,216,0.08)",
                    color: "var(--accent)",
                    border: "1px solid rgba(126,248,216,0.15)",
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={"external" in link && link.external ? "_blank" : undefined}
                      rel={"external" in link && link.external ? "noopener noreferrer" : undefined}
                      className="text-sm transition-colors duration-150 flex items-center gap-1"
                      style={{ color: "var(--text-muted)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"; }}
                    >
                      {link.label}
                      {"external" in link && link.external && <ExternalLink size={10} className="opacity-50" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t text-xs"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          <span>© {new Date().getFullYear()} Brevit by JavianDev. MIT License.</span>
          <span>v1.0.2 · JS · Python · .NET</span>
        </div>
      </div>
    </footer>
  );
}
