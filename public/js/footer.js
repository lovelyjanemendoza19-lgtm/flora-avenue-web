const footerScript = document.currentScript;
const siteRoot = new URL("../../", footerScript.src);
const footerStyles = document.createElement("link");
footerStyles.rel = "stylesheet";
footerStyles.href = new URL("../css/footer.css", footerScript.src).href;
document.head.append(footerStyles);

const siteFooter = document.createElement("footer");
siteFooter.className = "site-footer";
siteFooter.innerHTML = `
    <div class="site-footer-inner">
        <div class="site-footer-brand">
            <a class="site-footer-name" href="${new URL("index.html", siteRoot).href}">FLORA AVENUE</a>
            <p>Handmade crafts for every moment.</p>
        </div>
        <div class="site-footer-contact">
            <strong>Social &amp; Contact</strong>
            <span>Facebook (coming soon)</span>
            <span>Instagram (coming soon)</span>
            <span>Contact details coming soon</span>
        </div>
    </div>
    <p class="site-footer-copyright">&copy; ${new Date().getFullYear()} Flora Avenue</p>
`;

const pageContainer = document.querySelector(".website, .wrap");
if (pageContainer) {
    pageContainer.insertAdjacentElement("afterend", siteFooter);
} else {
    document.body.append(siteFooter);
}
