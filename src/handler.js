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
        const response = failResponse('Gagal menambahkan buku. Mohon isi nama buku', h);
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = failResponse('Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount', h);
        response.code(400);
        return response;
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
        const response = successResponseAll('Buku berhasil ditambahkan', {
            bookId: id,
        }, h);
        response.code(201);
        return response;
    }

    const response = failResponse('Buku gagal ditambahkan', h);
    response.code(500);
    return response;
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
        const response = successResponseWithData({ book }, h);
        response.code(200);
        return response;
    }

    const response = failResponse('Buku tidak ditemukan', h);
    response.code(404);
    return response;
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
        const response = failResponse('Gagal memperbarui buku. Mohon isi nama buku', h);
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = failResponse('Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount', h);
        response.code(400);
        return response;
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

        const response = successResponse('Buku berhasil diperbarui', h);
        response.code(200);
        return response;
    }

    const response = failResponse('Gagal memperbarui buku. Id tidak ditemukan', h);
    response.code(404);
    return response;
};

/*
 * Delete Book Method
 */
const deleteBookHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        const response = successResponse('Buku berhasil dihapus', h);
        response.code(200);
        return response;
    }

    const response = failResponse('Buku gagal dihapus. Id tidak ditemukan', h);
    response.code(404);
    return response;
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    updateBookHandler,
    deleteBookHandler,
};
