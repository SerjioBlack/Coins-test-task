document.addEventListener("DOMContentLoaded", () => {
    class CoinManager {
        constructor() {
            this.coins = [];
            this.favorites = this.getFavoritesFromCookies();
            this.searchBtn = document.getElementById("searchBtn");
            this.searchMenu = document.getElementById("searchMenu");
            this.searchInput = document.getElementById("searchInput");
            this.coinList = document.getElementById("coinList");
            this.favoritesBtn = document.getElementById("favoritesBtn");
            this.allCoinsBtn = document.getElementById("allCoinsBtn");
            
            this.setupEventListeners();
            this.fetchCoins();
        }

        setupEventListeners() {
            this.searchBtn.addEventListener("click", () => {
                this.searchMenu.classList.toggle("hidden");
            });

            this.searchInput.addEventListener("input", () => {
                const query = this.searchInput.value.toLowerCase();
                this.displayCoins(this.coins.filter(coin => coin.toLowerCase().includes(query)));
            });

            this.favoritesBtn.addEventListener("click", () => {
                this.displayCoins(this.favorites);
            });

            this.allCoinsBtn.addEventListener("click", () => {
                this.displayCoins(this.coins);
            });
        }

        async fetchCoins() {
            try {
                const response = await fetch("https://api-eu.okotoki.com/coins");
                const data = await response.json();
                this.coins = data.filter(coin => coin); // фильтруем пустые строки
                this.displayCoins(this.coins);
            } catch (error) {
                console.error("Error fetching coins:", error);
            }
        }

        displayCoins(coinsToDisplay) {
            this.coinList.innerHTML = "";
            coinsToDisplay.forEach(coin => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <span class="favorite">${this.favorites.includes(coin) ? "★" : "☆"}</span>
                    <span>${coin}</span>
                `;
                li.querySelector(".favorite").addEventListener("click", () => {
                    this.toggleFavorite(coin);
                    this.displayCoins(coinsToDisplay);
                });
                this.coinList.appendChild(li);
            });
        }

        toggleFavorite(coin) {
            if (this.favorites.includes(coin)) {
                this.favorites = this.favorites.filter(fav => fav !== coin);
            } else {
                this.favorites.push(coin);
            }
            this.setFavoritesInCookies(this.favorites);
        }

        getFavoritesFromCookies() {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; favorites=`);
            if (parts.length === 2) {
                try {
                    return JSON.parse(parts.pop().split(';').shift());
                } catch (e) {
                    return [];
                }
            }
            return [];
        }

        setFavoritesInCookies(favorites) {
            const d = new Date();
            d.setTime(d.getTime() + (365*24*60*60*1000)); // 1 year
            const expires = `expires=${d.toUTCString()}`;
            document.cookie = `favorites=${JSON.stringify(favorites)}; ${expires}; path=/`;
        }
    }

    new CoinManager();
});
