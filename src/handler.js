const { nanoid } = require('nanoid');
const books = require('./books');
const {
    failResponse,
    successResponse,
    successResponseWithData,
    successResponseAll,
} = require('./response');

/*
 * Add Book Method
 */
const addBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    if (!name) {
        return failResponse('Gagal menambahkan buku. Mohon isi nama buku', h)
            .code(400);
    }

    if (readPage > pageCount) {
        return failResponse('Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount', h)
            .code(400);
    }

    const id = nanoid(16);
    const insertedAt = new Date().toString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;
    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };
    books.push(newBook);

    const isSuccess = books.some((book) => book.id === id);

    if (isSuccess) {
        return successResponseAll('Buku berhasil ditambahkan', {
            bookId: id,
        }, h).code(201);
    }

    return failResponse('Buku gagal ditambahkan', h)
        .code(500);
};

/*
 * Get All Book Method
 */
const getAllBooksHandler = (request) => {
    const { name: bookName, reading, finished } = request.query;
    let data = books;

    if (bookName !== undefined) {
        data = data.filter((book) => book.name.toLowerCase().includes(bookName.toLowerCase()));
    }

    if (reading !== undefined) data = data.filter((book) => book.reading === (reading === '1'));

    if (finished !== undefined) data = data.filter((book) => book.finished === (finished === '1'));

    data = data.map((book) => {
        const { id, name, publisher } = book;
        return { id, name, publisher };
    });

    return {
        status: 'success',
        data: { books: data },
    };
};

/*
 * Add Book By Id Method
 */
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.filter((b) => b.id === bookId)[0];

    if (book !== undefined) {
        return successResponseWithData({ book }, h)
            .code(200);
    }

    return failResponse('Buku tidak ditemukan', h)
        .code(404);
};

/*
 * Update Book Method
 */
const updateBookHandler = (request, h) => {
    const { bookId } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    if (!name) {
        return failResponse('Gagal memperbarui buku. Mohon isi nama buku', h)
            .code(400);
    }

    if (readPage > pageCount) {
        return failResponse('Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount', h)
            .code(400);
    }

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
        };

        return successResponse('Buku berhasil diperbarui', h)
            .code(200);
    }

    return failResponse('Gagal memperbarui buku. Id tidak ditemukan', h)
        .code(404);
};

/*
 * Delete Book Method
 */
const deleteBookHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        return successResponse('Buku berhasil dihapus', h)
            .code(200);
    }

    return failResponse('Buku gagal dihapus. Id tidak ditemukan', h)
        .code(404);
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    updateBookHandler,
    deleteBookHandler,
};
