
const toggleMenu = (
    btn: HTMLButtonElement,
    menu: HTMLElement,
    expanded: boolean,
) => {
    btn.setAttribute("aria-expanded", String(expanded));
    menu.hidden = !expanded;
    // Improvement: Use the second argument of classList.toggle for cleaner code.
    menu.classList.toggle("open", expanded);
};

class MenuButton extends HTMLElement {
    // Keep a reference to the media query and listener for cleanup
    private mediaQuery: MediaQueryList;
    private mediaQueryListener: (e: MediaQueryListEvent) => void;

    constructor() {
        super();

        const template = this.querySelector("template");
        // Bug fix: Add a null check to prevent error if template is missing.
        if (!template) {
            console.error("MenuButton is missing its template.");
            return;
        }
        this.appendChild(template.content.cloneNode(true));

        const btn = this.querySelector("button");
        const menu = document.getElementById("menu-content");

        // Bug fix: Add null checks to prevent errors if button or menu are not found.
        if (!btn || !menu) {
            return;
        }

        // Hide menu (shown by default to support no-JS browsers).
        menu.hidden = true;

        // Toggle menu visibility when the menu button is clicked.
        this.addEventListener("click", () => toggleMenu(btn, menu, menu.hidden));

        // Hide menu button for large screens.
        const handleViewports = (e: MediaQueryList | MediaQueryListEvent) => {
            toggleMenu(btn, menu, e.matches);
            btn.hidden = e.matches;
        };

        this.mediaQueryListener = (e) => handleViewports(e);
        this.mediaQuery = window.matchMedia("(min-width: 50em)");

        handleViewports(this.mediaQuery);
        this.mediaQuery.addEventListener("change", this.mediaQueryListener);
    }

    // Improvement: Implement disconnectedCallback to clean up event listeners
    // when the element is removed from the DOM, preventing memory leaks.
    disconnectedCallback() {
        this.mediaQuery.removeEventListener("change", this.mediaQueryListener);
    }
}

customElements.define("menu-button", MenuButton);

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll<HTMLElement>("section[id]");
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(
        ".nav-items a.link",
    );

    if (!sections.length || !navLinks.length) return;

    // Improvement: Use a Map for efficient lookup of links by section ID,
    // avoiding nested loops in the observer callback.
    const navLinkMap = new Map<string, HTMLAnchorElement>();
    navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href?.startsWith("#")) {
            navLinkMap.set(href.substring(1), link);
        }
    });

    const observer = new IntersectionObserver(
        (entries) => {
            const intersectingEntries = entries.filter((e) => e.isIntersecting);
            if (intersectingEntries.length > 0) {
                // Get the last intersecting entry, which is the "current" one.
                const lastIntersectingEntry =
                    intersectingEntries[intersectingEntries.length - 1];
                const id = lastIntersectingEntry.target.id;

                // Clear all existing 'aria-current' attributes.
                navLinks.forEach((link) => link.removeAttribute("aria-current"));

                // Set the new 'aria-current'.
                const activeLink = navLinkMap.get(id);
                if (activeLink) {
                    activeLink.setAttribute("aria-current", "page");
                }
            }
        },
        {
            rootMargin: "-50% 0px -50% 0px",
        },
    );

    sections.forEach((section) => observer.observe(section));

    const setActiveLink = () => {
        const currentHash = window.location.hash.substring(1);
        if (currentHash) {
            const activeLink = navLinkMap.get(currentHash);
            if (activeLink) {
                navLinks.forEach((link) => link.removeAttribute("aria-current"));
                activeLink.setAttribute("aria-current", "page");
            }
        }
    }
    // Handle active link on initial page load if URL has a hash.
    setActiveLink();
    window.addEventListener('hashchange', setActiveLink);


    // Toggle menu visibility when a nav link is clicked (for mobile).
    const menuButton =
        document.querySelector<HTMLButtonElement>("menu-button button");
    const menu = document.getElementById("menu-content");
    if (menuButton && menu) {
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                // Only close the menu if it's currently open (on small screens).
                if (!menu.hidden) {
                    toggleMenu(menuButton, menu, false);
                }
            });
        });
    }
});
