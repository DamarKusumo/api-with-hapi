const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
	const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
	const id = nanoid(16);
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;
	let finished = false;
	if (pageCount === readPage) {finished = true;}

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
		updatedAt
	};
	
	if (name === undefined) {
		const response = h.response({
			status: "fail",
			message: "Gagal menambahkan buku. Mohon isi nama buku"
		});
		response.code(400);
		return response;
	}

	if (readPage > pageCount) {
		const response = h.response({
			status: "fail",
			message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
		});
		response.code(400);
		return response;
	}
  
	books.push(newBook);
	const isSuccess = books.filter((book) => book.id === id).length > 0;

	if (isSuccess) {
		const response = h.response({
			status: "success",
			message: "Buku berhasil ditambahkan",
			data: {
				bookId: id,
			},
		});
		response.code(201);
		return response;
	}
	const response = h.response({
		status: "fail",
		message: "Catatan gagal ditambahkan",
	});
	response.code(500);
	return response;
};

const getSpecifiedData = (books) => {
	const res = [];
	for (let i = 0; i < books.length; i++) {
		const temp = {
			id: books[i].id,
			name: books[i].name,
			publisher: books[i].publisher
		};
		res[i] = temp;
	}
	return res;
};

const getAllBooksHandler = (request, h) => {
	const { reading, finished, name } = request.query;
	if (reading == 0 || reading == 1) {
		const booksRead = books.filter((n) => n.reading == reading);
		const specifiedRead = getSpecifiedData(booksRead);
		const response = h.response({
			status: "success",
			data: {
				"books" : specifiedRead,
			},
		});
		response.code(200);
		return response;
	}
	if (finished == 0 || finished == 1) {
		const booksFinish = books.filter((n) => n.finished == finished);
		const specifiedFinish = getSpecifiedData(booksFinish);
		const response = h.response({
			status: "success",
			data: {
				"books" : specifiedFinish,
			},
		});
		response.code(200);
		return response;
	}
	if ( name !== undefined || null) {
		const bookNameFilter = books.filter((n) => n.name.toLowerCase().includes(name.toLowerCase()));
		const specifiedDataFilter = getSpecifiedData(bookNameFilter);
		const response = h.response({
			status: "success",
			data: {
				"books" : specifiedDataFilter,
			},
		});
		response.code(200);
		return response;
	}
	const res = getSpecifiedData(books);
	const response = h.response({
		status: "success",
		data: {
			books:
				res
			,
		},
	});
	response.code(200);
	return response;
};

const getBookByIdHandler = (request, h) => {
	const { bookId } = request.params;
	const book = books.filter((n) => n.id === bookId)[0];

	if (book !== undefined || null) {
		return {
			status: "success",
			data: {
				book,
			},
		};
	}
	const response = h.response({
		status: "fail",
		message: "Buku tidak ditemukan",
	});
	response.code(404);
	return response;
};

const editBookByIdHandler = (request, h) => {
	const { bookId } = request.params;

	const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
	const updatedAt = new Date().toISOString();

	const index = books.findIndex((book) => book.id === bookId);

	if (index !== -1) {
		if (name === undefined) {
			const response = h.response({
				status: "fail",
				message: "Gagal memperbarui buku. Mohon isi nama buku"
			});
			response.code(400);
			return response;
		}
	
		if (readPage > pageCount) {
			const response = h.response({
				status: "fail",
				message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
			});
			response.code(400);
			return response;
		}
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
			updatedAt,
		};
		const response = h.response({
			status: "success",
			message: "Buku berhasil diperbarui",
		});
		response.code(200);
		return response;
	}
	const response = h.response({
		status: "fail",
		message: "Gagal memperbarui buku. Id tidak ditemukan",
	});
	response.code(404);
	return response;
};

const deleteBookByIdHandler = (request, h) => {
	const { bookId } = request.params;

	const index = books.findIndex((book) => book.id === bookId);

	if (index !== -1) {
		books.splice(index, 1);
		const response = h.response({
			status: "success",
			message: "Buku berhasil dihapus",
		});
		response.code(200);
		return response;
	}

	const response = h.response({
		status: "fail",
		message: "Buku gagal dihapus. Id tidak ditemukan",
	});
	response.code(404);
	return response;
};

module.exports = {
	addBookHandler,
	getAllBooksHandler,
	getBookByIdHandler,
	editBookByIdHandler,
	deleteBookByIdHandler
};
