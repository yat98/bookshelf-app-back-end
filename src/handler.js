const { nanoid } = require('nanoid');
const books = require('./books');

const failResponse = (message, h) => h.response({
    status: 'fail', message,
});

const successResponse = (message, h) => h.response({
    status: 'success', message,
});

const successResponseWithData = (data, h) => h.response({
    status: 'success', data,
});

const successResponseAll = (message, data, h) => h.response({
    status: 'success', message, data,
});

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

const getAllBooksHandler = () => {
    const data = books.map(({ id, name, publisher } = books) => ({
        id,
        name,
        publisher,
    }));

    return {
        status: 'success',
        data: { books: data },
    };
};

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
