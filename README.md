# Time Tracker

Time Tracker to aplikacja webowa do śledzenia czasu pracy nad projektami, stworzona przy użyciu Next.js i Prisma.

## Funkcje

-   Rejestracja i logowanie użytkowników
-   Tworzenie i zarządzanie projektami
-   Śledzenie czasu pracy dla poszczególnych projektów
-   Wizualizacja danych w formie wykresów
-   Responsywny interfejs użytkownika

## Wymagania wstępne

-   Node.js (wersja 14 lub nowsza)
-   PostgreSQL

## Instrukcja instalacji

1. Sklonuj repozytorium:

    ```
    git clone https://github.com/twoje-konto/time-tracker.git
    cd time-tracker
    ```

2. Zainstaluj zależności:

    ```
    npm install
    ```

3. Skonfiguruj bazę danych:

    - Utwórz nową bazę danych PostgreSQL o nazwie `time_tracker`
    - Skopiuj plik `.env.example` do `.env` i zaktualizuj `DATABASE_URL` swoimi danymi dostępowymi do bazy danych

4. Wykonaj migracje bazy danych:

    ```
    npx prisma migrate dev
    ```

5. Wygeneruj klient Prisma:

    ```
    npx prisma generate
    ```

6. Uruchom serwer deweloperski:

    ```
    npm run dev
    ```

7. Otwórz przeglądarkę i przejdź pod adres `http://localhost:3000`

## Użytkowanie

1. Zarejestruj nowe konto użytkownika
2. Potwierdź adres e-mail
3. Zaloguj się do aplikacji
4. Utwórz nowy projekt
5. Rozpocznij śledzenie czasu dla wybranego projektu
6. Przeglądaj statystyki na stronie dashboard

## Struktura projektu

-   `/src/app` - Główne komponenty aplikacji i routing
-   `/src/components` - Komponenty React
-   `/src/lib` - Funkcje pomocnicze i konfiguracja
-   `/prisma` - Schemat bazy danych i migracje

## Technologie

-   Next.js
-   React
-   Prisma
-   PostgreSQL
-   Tailwind CSS
-   Shadcn/ui
-   Recharts
-   Zustand
