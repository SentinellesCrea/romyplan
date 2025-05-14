'use client';

export default function Footer() {
  return (
    <footer className="text-center text-sm text-[#110444] mt-10 py-4 bg-gradient-to-r from-[#f6ead4] to-[#dbcbb0] rounded-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 max-w-5xl mx-auto">
        {/* Copyright */}
        <div className="text-gray-600 text-sm text-center md:text-left">
          © {new Date().getFullYear()} Sentinelles Groupe. Tous droits réservés.
        </div>

        {/* Crédit à droite */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-gray-600">Site créé et designé par</span>
          <img
            src="/images/Sentinelles-Crea-noir.png"
            alt="Logo Sentinelles Créa"
            className="h-6"
          />
        </div>
      </div>
    </footer>
  );
}
