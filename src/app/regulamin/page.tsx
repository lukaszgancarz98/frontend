import Image from 'next/image';
import Link from 'next/link';

export default function Rage() {
    return (
        <div>
            <div
                id="header"
                className={`flex flex-row justify-between items-center lg:h-35 h-25 fixed top-0 left-0 lg:w-full w-[100vw] z-60 shadow-xl bg-black`}
            >
                <Link href="/" className="flex flex-col justify-start w-1/4">
                    <Image
                        src={'/logo.png'}
                        className="lg:h-24 lg:w-40 bg-transparent lg:ml-10"
                        alt="/placeholder.png"
                        width={1000}
                        height={1000}
                    />
                </Link>
                <div className="flex flex-col lg:w-2/4 w-3/4 justify-around items-center h-full">
                    <Image
                        src={'/text.png'}
                        className="object-contain w-full h-1/2 pr-1 lg:pr-0"
                        alt="/placeholder.png"
                        width={500}
                        height={500}
                    />
                </div>
                <div className="lg:w-1/4" />
            </div>
            <div className="pt-35 px-10">
                <div className="text-5xl pt-10 font-bold">
                    REGULAMIN SKLEPU THE SCHOOL OF CALISTHENICS
                </div>
                <div className="py-8">
                    <div className="text-xl font-semibold pb-2">
                        § 1 POSTANOWIENIA WSTĘPNE
                    </div>
                    <div>
                        <div>
                            1. Sklep internetowy theschoolofcalisthenics.pl
                            prowadzony jest przez Karolinę Kuczak
                            <br />
                            wpisaną/wpisanego do Centralnej Ewidencji i
                            Informacji o Działalności Gospodarczej
                            <br />
                            prowadzonej przez Ministra Gospodarki, nr NIP
                            5020036564
                            <br />
                        </div>
                        <div>
                            2. Niniejszy regulamin stanowi zasady zawierania
                            umów sprzedaży zawieranych na odległość za
                            <br />
                            pośrednictwem Sklepu.
                            <br />
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="text-xl font-semibold pb-2">
                        §2 DEFINICJE
                    </div>
                    <div>
                        <div>
                            1. Konsument – Użytkownik będący osobą fizyczną
                            dokonującą z Przedsiębiorcą w ramach sklepu
                            <br />
                            THE SCHOOL OF CALISTHENICS czynności prawnej
                            niezwiązanej bezpośrednio z jego działalnością
                            gospodarczą lub zawodową
                        </div>
                        <div>
                            2. Przedsiębiorca – Karolina Kuczak, z siedzibą:
                            Koźlice 33, 59-180 Gaworzyce
                            <br />
                            wpisaną/wpisanego do Centralnej Ewidencji i
                            Informacji o Działalności Gospodarczej
                            <br />
                            prowadzonej przez Ministra Gospodarki, nr NIP
                            5020036564
                            <br />
                        </div>
                        <div>
                            3. Użytkownik – każdy podmiot dokonujący zakupów za
                            pośrednictwem Sklepu.
                        </div>
                        <div>
                            4. Sklep – sklep internetowy prowadzony przez
                            Przedsiębiorcę pod adresem
                            https://theschoolofcalisthenics.pl/
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="text-xl font-semibold pb-2">
                        § 3 KONTAKT
                    </div>
                    <div>
                        <div>
                            1. Adres przedsiębiorstwa: Koźlice 33, 59-180
                            Gaworzyce, email: kontakt@theschoolofcalisthenics.pl
                        </div>
                        <div>
                            2. Konsument może porozumieć się z Przedsiębiorcą za
                            pośrednictwem adresów i danych
                            <br />
                            podanych w niniejszym paragrafie.
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="text-xl font-semibold pb-2">
                        § 4 INFORMACJE WSTĘPNE
                    </div>
                    <div>
                        <div>
                            1. Ceny podane w Sklepie są podane w polskich
                            złotych i są cenami brutto
                        </div>
                        <div>
                            2. Na ostateczna cenę zamówienia składa się cena za
                            towar oraz koszt dostawy wskazane na stronach Sklepu
                        </div>
                        <div>
                            3. Wyrażam zgodę na wysłanie mi faktury drogą
                            elektroniczną na podany w formularzu złożenia
                            zamówienia
                            <br />
                            adres e-mail, która to faktura stanowi dowód zakupu
                            określonej w jej treści towarów. Przyjmuję do
                            wiadomości,
                            <br />
                            iż faktura w formie elektronicznej jest jedynym
                            dowodem dokonania zakupu określonych na niej
                            towarów,
                            <br />
                            a na jej podstawie mam prawo realizować wszelkie
                            uprawnienia wynikające z przepisów o rękojmi za wady
                            lub
                            <br />
                            prawne rzeczy, z przepisów ustawy o Prawach
                            Konsumenta, w tym zrealizować prawo do odstąpienia
                            od umowy
                            <br />
                            zawartej poza lokalem przedsiębiorstwa.
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="text-xl font-semibold pb-2">
                        § 5 WYKONANIE UMOWY SPRZEDAŻY
                    </div>
                    <div>
                        <div>
                            1. Użytkownik powinien zapłacić Przedsiębiorcy za
                            zakupiony towar w terminie 1 dni.
                        </div>
                        <div>
                            2. Użytkownik może skorzystać m.in. z następujących
                            form płatności:
                            <br />
                            a. przelew tradycyjny
                            <br />
                            b. przelew za pośrednictwem Przelewy24.pl
                            <br />
                            c. płatność Blik
                            <br />
                        </div>
                        <div>
                            3. Szczegółowe informacje dotyczące akceptowanych
                            metod płatności znajdują się na stronach Sklepu.
                        </div>
                        <div>
                            4. Towar zostanie wysłany przez Przedsiębiorcę w
                            terminie wskazanym w zakładce Dostawa i Płatność,
                            <br />w sposób wybrany przez Konsumenta podczas
                            składania zamówienia.
                        </div>
                        <div>
                            5. Dostawa towaru odbywa się wyłącznie na terenie
                            Polski.
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="text-xl font-semibold pb-2">
                        § 6 PRAWO ODSTĄPIENIA OD UMOWY
                    </div>
                    <div>
                        <div>
                            1. Konsument ma prawo odstąpić od umowy w terminie
                            14 dni bez podania jakiejkolwiek przyczyny,
                            <br />
                            wyjątkiem są Plany treningowe tych po zakupie
                            zwrócić nie można, kupując
                            <br />
                            ten produkt akceptujesz ten fakt
                        </div>
                        <div>
                            2. Termin do odstąpienia od umowy wygasa po upływie
                            14 dni od dnia w którym Konsument wszedł
                            <br />
                            w posiadanie rzeczy lub w którym osoba trzecia inna
                            niż przewoźnik i wskazana przez
                            <br />
                            Konsumenta weszła w posiadanie rzeczy
                        </div>
                        <div>
                            3. Aby skorzystać z prawa odstąpienia od umowy,
                            Konsument musi poinformować Przedsiębiorcę o<br />
                            swojej decyzji o odstąpieniu od umowy w drodze
                            jednoznacznego oświadczenia – korzystając z<br />
                            danych Przedsiębiorcy podanych w niniejszym
                            regulaminie.
                        </div>
                        <div>
                            4. Konsument może skorzystać z wzoru formularza
                            odstąpienia od umowy, który otrzyma drogą mailową
                            <br />
                            od sprzedawcy po uprzednim skontaktowaniu się.
                        </div>
                        <div>
                            5. Aby zachować termin do odstąpienia od umowy,
                            wystarczy, aby Konsument wysłał informację
                            <br />
                            dotyczącą wykonania przysługującego prawa
                            odstąpienia od umowy przed upływem terminu do
                            <br />
                            odstąpienia od umowy.
                        </div>
                        <div>
                            6. Skutki odstąpienia od umowy:
                            <br />
                            a. w przypadku odstąpienia od umowy Przedsiębiorca
                            zwraca Konsumentowi koszty produktu/produktów razem
                            <br />
                            z kosztami przesyłki. Nie później niż 14 dni od
                            dnia, w którym Przedsiębiorca
                            <br />
                            został poinformowany o decyzji Konsumenta o
                            wykonaniu prawa odstąpienia od umowy.;
                            <br />
                            b. Przedsiębiorca może wstrzymać się ze zwrotem
                            płatności do czasu otrzymania towaru lub do
                            <br />
                            czasu dostarczenia mu dowodu jego odesłania, w
                            zależności od tego, które zdarzenie
                            <br />
                            nastąpi wcześniej;
                            <br />
                            c. Konsument powinien odesłać towar na adres
                            kontaktowy Przedsiębiorcy podany w niniejszym
                            <br />
                            regulaminie niezwłocznie, a w każdym razie nie
                            później niż 14 dni od dnia, w którym
                            <br />
                            poinformował Przedsiębiorcę o odstąpieniu od umowy.
                            Termin zostanie zachowany, jeżeli
                            <br />
                            Konsument odeśle towar przed upływem terminu 14 dni;
                            <br />
                            d. Konsument ponosi bezpośrednie koszty zwrotu
                            rzeczy;
                            <br />
                            e. Konsument odpowiada tylko za zmniejszenie
                            wartości rzeczy wynikające z korzystania z niej
                            <br />
                            w sposób inny niż było to konieczne do stwierdzenia
                            charakteru, cech i funkcjonowania
                            <br />
                            rzeczy.
                        </div>
                        <div>
                            7. W przypadku gdy ze względu na swój charakter
                            rzeczy nie mogą zostać w zwykłym trybie
                            <br />
                            odesłane pocztą informacja o tym, a także o kosztach
                            zwrotu rzeczy, będzie się znajdować w<br />
                            opisie rzeczy w Sklepie.
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="text-xl font-semibold pb-2">
                        § 7 REKLAMACJA i GWARANCJA
                    </div>
                    <div>
                        <div>
                            1. Przedsiębiorca jest zobowiązany do dostarczenia
                            rzeczy wolnej od wad.
                        </div>
                        <div>
                            2. W przypadku wystąpienia wady zakupionego u
                            Przedsiębiorcy towaru Konsument ma prawo do
                            <br />
                            reklamacji w oparciu o rękojmię uregulowaną
                            przepisami kodeksu cywilnego.
                        </div>
                        <div>
                            3. Reklamację należy zgłosić pisemnie lub drogą
                            elektroniczną na podane w niniejszym
                            <br />
                            regulaminie adresy Przedsiębiorcy.
                        </div>
                        <div>
                            4. Zaleca się aby w reklamacji zawrzeć m.in. zwięzły
                            opis wady, datę jej wystąpienia, dane
                            <br />
                            Konsumenta składającego reklamację oraz żądanie
                            Konsumenta w związku z wadą towaru.
                        </div>
                        <div>
                            5. Przedsiębiorca ustosunkuje się do żądania
                            reklamacyjnego Konsumenta w terminie 14 dni, a<br />
                            jeśli nie zrobi tego w tym terminie uważa się, że
                            żądanie Konsumenta uznał za uzasadnione.
                        </div>
                        <div>
                            6. Towary odsyłane w ramach procedury reklamacyjnej
                            należy wysyłać na adres podany w § 3<br />
                            Regulaminu.
                        </div>
                        <div>
                            7. W przypadku gdy na produkt została udzielona
                            gwarancja informacja o niej, a także jej treść,
                            <br />
                            będą zawarte przy opisie produktu w Sklepie.
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="text-xl font-semibold pb-2">
                        § 8 POZASĄDOWE SPOSOBY ROZPATRYWANIA REKLAMACJI i
                        DOCHODZENIA ROSZCZEŃ
                    </div>
                    <div>
                        <div>
                            1. Konsument ma możliwość skorzystania m.in. z:
                            <br />
                            a. mediacji prowadzonej przez Wojewódzkie
                            Inspektoraty Inspekcji Handlowej.
                            <br />
                            b. pomocy stałych polubownych sądów konsumenckich
                            działających przy Wojewódzkich
                            <br />
                            Inspektoratach Inspekcji Handlowej
                        </div>
                    </div>
                </div>
                § 8 POZASĄDOWE SPOSOBY ROZPATRYWANIA REKLAMACJI i DOCHODZENIA
                ROSZCZEŃ 1. Konsument ma możliwość skorzystania m.in. z: a.
                mediacji prowadzonej przez Wojewódzkie Inspektoraty Inspekcji
                Handlowej. b. pomocy stałych polubownych sądów konsumenckich
                działających przy Wojewódzkich Inspektoratach Inspekcji
                Handlowej
                <div className="py-8">
                    <div className="text-xl font-semibold pb-2">
                        § 9 DANE OSOBOWE
                    </div>
                    <div>
                        <div>
                            1. Użytkownik dokonując zakupów w Sklepie
                            dobrowolnie podaje swoje dane,
                            <br />
                            które są koniecznedla zrealizowania zamówienia oraz
                            ewentualnego kontaktu z klientem.
                            <br />
                            Będą przetwarzane wyłącznie w tym celu przez
                            przedsiębiorcę, w sposób zgodny z prawem.
                        </div>
                        <div>
                            2. Użytkownik ma prawo wglądu do dotyczących go
                            danych osobowych, żądania
                            <br />
                            poprawienia ich, przeniesienia, usunięcia bądź
                            zaprzestania ich przetwarzania.
                        </div>
                        <div>
                            3. Administratorem danych osobowych jest
                            Przedsiębiorca.
                        </div>
                        <div>
                            4. Dane osobowe Użytkowników nie są udostępniane
                            podmiotom trzecim,
                            <br />
                            za wyjątkiem firm pośredniczących w transakcjach
                            płatniczych oraz dostawców,
                            <br />
                            dla których dane te są niezbędne do realizacji
                            płatności czy dostarczenia przesyłki.
                        </div>
                        <div>
                            5. Dane osobowe użytkownika są przetwarzane do czasu
                            zakończenia świadczenia usług
                            <br />
                            droga elektroniczna bądź do czasu istnienia podstawy
                            prawnej do ich przetwarzania.
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="text-xl font-semibold pb-2">
                        § 10 POSTANOWIENIA KOŃCOWE
                    </div>
                    <div>
                        <div>
                            1. W kwestiach nieuregulowanych w niniejszym
                            regulaminie mają zastosowanie powszechnie
                            <br />
                            obowiązujące przepisy prawa polskiego, w
                            szczególności: ustawa o prawach konsumenta z dnia
                            <br />
                            30 maja 2014 r., ustawa kodeks cywilny z dnia 23
                            kwietnia 1964 r. oraz ustawa kodeks
                            <br />
                            postępowania cywilnego z dnia 17 listopada 1964 r.
                        </div>
                        <div>
                            2. Umowa sprzedaży zawierana w oparciu o niniejszy
                            regulamin dotyczy konkretnego zamówienia i<br />
                            jest zawierana w celu realizacji jednorazowego
                            zamówienia. Każde zamówienie wymaga osobnej
                            <br />
                            akceptacji regulaminu.
                        </div>
                    </div>
                </div>
                <div className="py-8">
                    <div className="text-xl font-semibold pb-2">
                        PŁATNOŚĆ ZA ZAMÓWIENIE
                    </div>
                    <div>
                        Realizujemy trzy sposoby płatności:
                        <br />
                        – Płatność poprzez Przelewy24.pl
                        <br />
                        – Płatność PayPal
                        <br />– Płatność Blik
                    </div>
                </div>
                <div className="py-8">
                    <div className="text-xl font-semibold pb-2">DOSTAWA</div>
                    <div>
                        Wysyłka paczki w następny dzień roboczy, jeśli
                        zamówienie zostanie złożone do godziny 21:30.
                    </div>
                    <div>Dostawa trwa zazwyczaj 2 dni robocze</div>
                </div>
                <div className="py-8">
                    <div className="text-xl font-semibold pb-2">KONTAKT:</div>
                    <div>email: kontakt@theschoolofcalisthenics.pl</div>
                </div>
            </div>
        </div>
    );
}
