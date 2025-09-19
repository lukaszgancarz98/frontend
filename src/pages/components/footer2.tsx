interface MenuItem {
    title: string;
    links: { text: string; url: string; openTab?: boolean }[];
}

interface Footer2Props {
    logo?: { url: string; src: string; alt: string; title: string };
    tagline?: string;
    menuItems?: MenuItem[];
    copyright?: string;
    bottomLinks?: { text: string; url: string }[];
}

const Footer2 = ({
    menuItems = [
        {
            title: 'O nas',
            links: [
                { text: 'Intro', url: '/#home' },
                { text: 'Zdjęcia', url: '/#photos' },
                { text: 'Trening personalny', url: '/#activities' },
                { text: 'Szkolenia', url: '/#activities' },
                { text: 'Obozy', url: '/#activities' },
            ],
        },
        {
            title: 'Sklep',
            links: [
                { text: 'Produkty', url: '/#products' },
                { text: 'Plany treningowe', url: '/#videos' },
                { text: 'Rozmiarówka', url: '/sizes' },
                { text: 'Regulamin', url: '/regulamin' },
            ],
        },
        {
            title: 'Social media',
            links: [
                {
                    text: 'Facebook',
                    url: 'https://www.facebook.com/Kalistenikazg',
                    openTab: true,
                },
                {
                    text: 'Instagram',
                    url: 'https://www.instagram.com/theschoolofcalisthenics/?hl=en',
                    openTab: true,
                },
            ],
        },
    ],
    copyright = 'Copyright theschoolofcalistenics.pl 2025-2026',
}: Footer2Props) => {
    return (
        <section className="lg:py-24 py-5 w-full bg-black text-white">
            <div className="w-full">
                <footer>
                    <div className="flex px-5 grid-cols-2 gap-8 lg:grid-cols-6 justify-evenly items-start content-center">
                        {menuItems.map((section, sectionIdx) => (
                            <div key={sectionIdx}>
                                <h3 className="mb-4 font-bold">
                                    {section.title}
                                </h3>
                                <ul className="text-muted-foreground space-y-4">
                                    {section.links.map((link, linkIdx) => (
                                        <li
                                            key={linkIdx}
                                            className="hover:text-primary font-medium"
                                        >
                                            <a
                                                href={link.url}
                                                target={
                                                    link.openTab
                                                        ? '_blank'
                                                        : undefined
                                                }
                                                rel={
                                                    link.openTab
                                                        ? 'noopener noreferrer'
                                                        : undefined
                                                }
                                            >
                                                {link.text}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="text-muted-foreground lg:mt-24 mt-10 flex flex-col justify-center gap-4 border-t pt-8 text-sm font-medium md:flex-row md:items-center">
                        <p className="text-center">{copyright}</p>
                    </div>
                </footer>
            </div>
        </section>
    );
};

export default Footer2;
