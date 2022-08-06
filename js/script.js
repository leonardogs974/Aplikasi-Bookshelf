const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const SEARCH_EVENT = 'search-book';
const UPDATE_EVENT = 'update-book';
const BOOKS_KEY = 'BOOKSHELF_APPS';

function checkStorage() {
    if (typeof (Storage) !== undefined) {
        return true;
    }
    alert('Browser Tidak Mendukung Local Storage');
    return false;
}

function createId() {
    return +new Date();
}

function createBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function makeBook(bookObject) {
    const { id, title, author, year, isComplete } = bookObject;

    const textTitle = document.createElement('h3');
    textTitle.innerText = title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = 'Penulis : ' + author;

    const textYear = document.createElement('p');
    textYear.innerText = 'Tahun Terbit : ' + year;

    //Buat Sisi Kanan dan Kiri dulu
    const textLeftSide = document.createElement('div');
    textLeftSide.classList.add('leftSide');
    textLeftSide.append(textTitle, textAuthor, textYear);

    const textRightSide = document.createElement('div');
    textRightSide.classList.add('rightSide');

    //Buat Penampung Kedua Side
    const textItemField = document.createElement('div');
    textItemField.classList.add('itemField');
    textItemField.append(textLeftSide, textRightSide);

    //Buat Container
    const container = document.createElement('div');
    container.classList.add('items');
    container.append(textItemField);
    container.setAttribute('id', `book-${id}`);

    if (isComplete) {
        const finishButton = document.createElement('button');
        finishButton.classList.add('finishButton');
        finishButton.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>';
        finishButton.addEventListener('click', function () {
            finishReadBookFromCompleted(id);
        });

        const editButton = document.createElement('button');
        editButton.classList.add('editButton');
        editButton.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';
        editButton.addEventListener('click', function () {
            editBook(id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('deleteButton');
        deleteButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
        deleteButton.addEventListener('click', function () {
            removeBook(id);
        });

        textRightSide.append(finishButton, editButton, deleteButton);
    } else {
        const notFinishButton = document.createElement('button');
        notFinishButton.classList.add('noFinishButton');
        notFinishButton.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';
        notFinishButton.addEventListener('click', function () {
            notFinishReadBookFromUncompleted(id);
        });

        const editButton = document.createElement('button');
        editButton.classList.add('editButton');
        editButton.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';
        editButton.addEventListener('click', function () {
            editBook(id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('deleteButton');
        deleteButton.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
        deleteButton.addEventListener('click', function () {
            removeBook(id);
        });

        textRightSide.append(notFinishButton, editButton, deleteButton);
    }

    return container;
}

function addBook() {
    const textTitles = document.getElementById('inputJudul').value;
    const textAuthors = document.getElementById('inputPenulis').value;
    const textYears = document.getElementById('inputTahun').value;
    const textisComplete = document.getElementById('inputKeterangan');
    const getId = createId();

    let status = false;
    if (textisComplete.checked) {
        status = true;
    }

    if(textTitles != "" && textAuthors != "" && textYears != ""){
        const bookObject = createBookObject(getId, textTitles, textAuthors, textYears, status);

        books.push(bookObject);
        document.dispatchEvent(new Event(RENDER_EVENT));
        myTextBox('Berhasil Disimpan');
        saveData();
        resetInput();
    } else {
        myTextBox('Data Kosong atau Belum Lengkap');
    }
}

function updateBook(bookId) {
    const textTitles = document.getElementById('inputJudul').value;
    const textAuthors = document.getElementById('inputPenulis').value;
    const textYears = document.getElementById('inputTahun').value;
    const textisComplete = document.getElementById('inputKeterangan');

    const bookTarget = findBook(bookId);
    const bookTargetIndex = findBookIndex(bookId);

    if (bookTarget === null) return;
    if (bookTargetIndex === -1) return;

    let status = false;
    if (textisComplete.checked) {
        status = true;
    }

    const bookObject = createBookObject(bookId, textTitles, textAuthors, textYears, status);
    books[bookTargetIndex] = bookObject;
    document.dispatchEvent(new Event(RENDER_EVENT));
    myTextBox('Berhasil Diupdate');
    updateData();
    resetInputUpdate();
}

function editBook(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget === null) return;

    const textTitles = document.getElementById('inputJudul');
    const textAuthors = document.getElementById('inputPenulis');
    const textYears = document.getElementById('inputTahun');
    const textisComplete = document.getElementById('inputKeterangan');
    const textId = document.getElementById('inputIdBook');

    textId.value = bookTarget.id;
    textTitles.value = bookTarget.title;
    textAuthors.value = bookTarget.author;
    textYears.value = bookTarget.year;
    textisComplete.checked = bookTarget.isComplete;

    const btnTmp = document.getElementById('btnSubmit');
    btnTmp.setAttribute('disabled', 'true');

    const btnTmp2 = document.getElementById('btnUpdate');
    btnTmp2.removeAttribute('disabled');
    btnTmp2.setAttribute('onclick', `updateBook(${bookTarget.id})`);

    const formData = document.getElementById('formDataBuku');
    formData.setAttribute('id', 'formDataBukuUpdate');

    const cancelEdit = document.createElement('button');
    cancelEdit.classList.add('cancelEdit');
    cancelEdit.innerHTML = 'Batal Edit';
    cancelEdit.addEventListener('click', function () {
        resetInputUpdate();
    });

    const formDataBuku = document.getElementById('formDataBukuUpdate');
    const itemField = document.createElement('div');
    itemField.setAttribute('class', 'formComponent');
    itemField.append(cancelEdit);
    formDataBuku.append(itemField);

}

function resetInput() {
    const textTitles = document.getElementById('inputJudul');
    const textAuthors = document.getElementById('inputPenulis');
    const textYears = document.getElementById('inputTahun');
    const textisComplete = document.getElementById('inputKeterangan');
    const textId = document.getElementById('inputIdBook');

    textTitles.value = null;
    textAuthors.value = null;
    textYears.value = null;
    textId.value = null;
    textisComplete.checked = false;
    
    const btnTmp = document.getElementById('btnSubmit');
    btnTmp.removeAttribute('disabled');
    
    const btnTmp2 = document.getElementById('btnUpdate');
    btnTmp2.setAttribute('disabled', 'true');

}

function resetInputUpdate() {
    const textTitles = document.getElementById('inputJudul');
    const textAuthors = document.getElementById('inputPenulis');
    const textYears = document.getElementById('inputTahun');
    const textisComplete = document.getElementById('inputKeterangan');
    const textId = document.getElementById('inputIdBook');

    textTitles.value = null;
    textAuthors.value = null;
    textYears.value = null;
    textId.value = null;
    textisComplete.checked = false;
    
    const btnTmp = document.getElementById('btnSubmit');
    btnTmp.removeAttribute('disabled');
    
    const btnTmp2 = document.getElementById('btnUpdate');
    btnTmp2.setAttribute('disabled', 'true');

    const formDataBuku = document.getElementById('formDataBukuUpdate');
    formDataBuku.lastChild.remove();
    formDataBuku.setAttribute('id', 'formDataBuku');

}

function finishReadBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    myTextBox('Berhasil Dipindahkan');
    saveData();
}

function notFinishReadBookFromUncompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    myTextBox('Berhasil Dipindahkan');
    saveData();
}

function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    myTextBox('Berhasil Dihapus');
    saveData();
}

function saveData() {
    if (checkStorage()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(BOOKS_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function updateData() {
    if (checkStorage()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(BOOKS_KEY, parsed);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(BOOKS_KEY);
    let data = JSON.parse(serializedData);

    if (data != null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function myTextBox(text) {
    const x = document.getElementById('textBox');
    x.innerText = text;
    x.className = "show";
    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
}

document.addEventListener(SEARCH_EVENT, function () {
    const uncompletedBookList = document.getElementById('uncompleted');
    const completedBookList = document.getElementById('completed');
    const valueSearch = document.getElementById('boxCari').value;

    //Bersihkan Seluruh List Item
    uncompletedBookList.innerText = '';
    completedBookList.innerText = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        const valueLength = valueSearch.length;
        const tmpTitle = bookItem.title.toLowerCase();
        const tmpValue = valueSearch.toLowerCase();

        if (tmpTitle.substring(0, valueLength) == tmpValue && bookItem.isComplete == true) {
            completedBookList.append(bookElement);
        } else if (tmpTitle.substring(0, valueLength) == tmpValue && bookItem.isComplete == false) {
            uncompletedBookList.append(bookElement);
        } else if (valueSearch === '') {
            location.reload();
        }
    }
});

const boxSearch = document.getElementById('boxCari');
boxSearch.addEventListener('keyup', function (event) {
    event.preventDefault();
    document.dispatchEvent(new Event(SEARCH_EVENT));
});

document.addEventListener('DOMContentLoaded', function () {
    if (checkStorage()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById('uncompleted');
    const completedBookList = document.getElementById('completed');

    //Bersihkan Seluruh List Item
    uncompletedBookList.innerText = '';
    completedBookList.innerText = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isComplete) {
            completedBookList.append(bookElement);
        } else {
            uncompletedBookList.append(bookElement);
        }
    }
});

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(BOOKS_KEY));
});

