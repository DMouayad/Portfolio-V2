
class MenuButton extends HTMLElement {
    constructor() {
        super();

        // Inject menu toggle button when JS runs.
        this.appendChild(
            this.querySelector("template")!.content.cloneNode(true),
        );
        const btn = this.querySelector("button")!;

        // Hide menu (shown by default to support no-JS browsers).
        const menu = document.getElementById("menu-content")!;
        menu.hidden = true;
        // Add "menu-content" class in JS to avoid covering content in non-JS browsers.
        menu.classList.add("menu-content");

        /** Set whether the menu is currently expanded or collapsed. */
        const setExpanded = (expand: boolean) => {
            btn.setAttribute("aria-expanded", expand ? "true" : "false");
            menu.hidden = !expand;
        };

        // Toggle menu visibility when the menu button is clicked.
        this.addEventListener("click", () => setExpanded(menu.hidden));

        // Hide menu button for large screens.
        const handleViewports = (
            e: MediaQueryList | MediaQueryListEvent,
        ) => {
            setExpanded(e.matches);
            btn.hidden = e.matches;
        };
        const mediaQueries = window.matchMedia("(min-width: 50em)");
        handleViewports(mediaQueries);
        mediaQueries.addEventListener("change", handleViewports);
    }
}
customElements.define("menu-button", MenuButton);

document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-items a.link");

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    for (const link of navLinks) {
                        if (link.getAttribute("href") === `#${id}`) {
                            link.setAttribute("aria-current", "page");
                        } else {
                            link.removeAttribute("aria-current");
                        }
                    }
                }
            }
        },
        {
            rootMargin: "-50% 0px -50% 0px",
        },
    );
    const menuButton = document.querySelector("menu-button .menu-button");
    const menu = document.getElementById("menu-content")!;
    for (const link of navLinks) {
        link.addEventListener("click", function (e) {
            if (
                menuButton &&
                menuButton.getAttribute("aria-expanded") === "true"
            ) {
                menuButton.setAttribute("aria-expanded", "false");
                menu.hidden = true;
            }
        });
    }

    for (const section of sections) {
        observer.observe(section);
    }
});