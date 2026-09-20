import { siteConfig } from "../config";

export default function WhatsAppFloatingButton() {
  const message = encodeURIComponent(
    `Bonjour ${siteConfig.name}, j'ai une question.`
  );
  const url = `https://wa.me/${siteConfig.whatsappNumber}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter sur WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-105 transition-transform"
      style={{ width: "3.25rem", height: "3.25rem" }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12.001 2C6.478 2 2 6.477 2 12c0 1.86.505 3.639 1.462 5.203L2 22l4.938-1.437A9.955 9.955 0 0 0 12.001 22C17.523 22 22 17.523 22 12S17.523 2 12.001 2zm0 18.163a8.14 8.14 0 0 1-4.15-1.134l-.298-.176-3.075.895.902-3.03-.194-.31A8.14 8.14 0 0 1 3.84 12c0-4.502 3.66-8.163 8.161-8.163 4.502 0 8.163 3.66 8.163 8.163 0 4.502-3.661 8.163-8.163 8.163z" />
      </svg>
    </a>
  );
}
