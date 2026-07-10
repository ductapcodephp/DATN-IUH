document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const searchDropdown = document.getElementById('searchDropdown');
    const searchResults = document.getElementById('searchResults');
    const searchLoading = document.getElementById('searchLoading');
  
    // 1. Core Debounce Function
    function debounce(func, delay) {
      let timeoutId;
      return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      };
    }
  
    // 2. Fetch API Simulation (Thay thế endpoint thực tế vào đây)
    const fetchSearchResults = async (query) => {
      if (!query.trim()) {
        searchDropdown.classList.remove('show');
        return;
      }
  
      searchDropdown.classList.add('show');
      searchLoading.classList.remove('d-none');
      searchResults.innerHTML = '';
  
      // Simulate API Network Delay
      await new Promise(resolve => setTimeout(resolve, 400));
      searchLoading.classList.add('d-none');
  
      // Dữ liệu giả lập (Sau này lấy từ fetch('/api/search'))
      const mockData = [
        { id: 1, title: `Kết quả cho "${query}"`, cat: 'Frontend', img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100' }
      ];
  
      if (mockData.length > 0) {
        searchResults.innerHTML = mockData.map(item => `
          <div class="search-item" onclick="window.location.href='/course/${item.id}'">
            <img src="${item.img}" alt="Thumb">
            <div>
              <h6>${item.title}</h6>
              <p class="mb-0 text-muted" style="font-size:0.8rem">${item.cat}</p>
            </div>
          </div>
        `).join('');
      } else {
        searchResults.innerHTML = `<div class="p-3 text-center text-muted">Không tìm thấy kết quả</div>`;
      }
    };
  
    // 3. Bind Event
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        fetchSearchResults(e.target.value);
      }, 300));
  
      // Handle Close Dropdown Click Outside
      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
          searchDropdown.classList.remove('show');
        }
      });
  
      // Handle Re-open
      searchInput.addEventListener('focus', () => {
        if(searchInput.value.trim().length > 0) {
          searchDropdown.classList.add('show');
        }
      });
    }
});