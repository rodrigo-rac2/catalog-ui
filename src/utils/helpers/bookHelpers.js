export function displayBooks(books) {
    const list = document.getElementById('books-list');
    if (!list) {
        console.error('displayBooks: No element found with ID "books-list"');
        return;
    }
    list.innerHTML = '';
    books.forEach(book => {
        const item = document.createElement('li');
        item.textContent = `${book.title} - ISBN: ${book.isbn}`;
        list.appendChild(item);
    });
}

