import { sideBarData } from "../data/sidebarData";

export default function SideNavLinks(): string {
  const { navLinks } = sideBarData;
  return navLinks
    .map(
      (navLink) => `
    <li>
    <button class="nav-button cursor-pointer flex items-center text-[rgb(32,33,36)] font-google-sans min-h-[50px] min-w-[48px] pl-2 rounded-tr-[25px] rounded-br-[25px] w-20 transition-all duration-500 ease-in-out">
    <div class="p-3 rounded-full nav-icon">${navLink.icon}</div>
    <span class="nav-title ps-6">${navLink.title}</span>
    </button>
    </li>
  `
    )
    .join("");
}
