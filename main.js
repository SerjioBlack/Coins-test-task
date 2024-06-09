document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("searchBtn");
    const searchMenu = document.getElementById("searchMenu");
    const searchInput = document.getElementById("searchInput");
    const coinList = document.getElementById("coinList");
    const favoritesBtn = document.getElementById("favoritesBtn");
    const allCoinsBtn = document.getElementById("allCoinsBtn");

    let coins = [];
    let favorites = getFavoritesFromCookies();

    searchBtn.addEventListener("click", () => {
        searchMenu.classList.toggle("hidden");
    });

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        displayCoins(coins.filter(coin => coin.toLowerCase().includes(query)));
    });

    favoritesBtn.addEventListener("click", () => {
        displayCoins(favorites);
    });

    allCoinsBtn.addEventListener("click", () => {
        displayCoins(coins);
    });

    const fetchCoins = async () => {
        try {
            const response = await fetch("https://api-eu.okotoki.com/coins");
            const data = await response.json();
            coins = data.filter(coin => coin); // фильтруем пустые строки
            displayCoins(coins);
        } catch (error) {
            console.error("Error fetching coins:", error);
        }
    };

    const displayCoins = (coinsToDisplay) => {
        coinList.innerHTML = "";
        coinsToDisplay.forEach(coin => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span class="favorite">${favorites.includes(coin) ? "★" : "☆"}</span>
                <span>${coin}</span>
            `;
            li.querySelector(".favorite").addEventListener("click", () => {
                toggleFavorite(coin);
                displayCoins(coinsToDisplay);
            });
            coinList.appendChild(li);
        });
    };

    const toggleFavorite = (coin) => {
        if (favorites.includes(coin)) {
            favorites = favorites.filter(fav => fav !== coin);
        } else {
            favorites.push(coin);
        }
        setFavoritesInCookies(favorites);
    };

    fetchCoins();

    function getFavoritesFromCookies() {
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

    function setFavoritesInCookies(favorites) {
        const d = new Date();
        d.setTime(d.getTime() + (365*24*60*60*1000)); // 1 year
        const expires = `expires=${d.toUTCString()}`;
        document.cookie = `favorites=${JSON.stringify(favorites)}; ${expires}; path=/`;
    }
});
