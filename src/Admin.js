import React, { useState, useEffect } from 'react';
import './App.css';

function Admin({ onLogout }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5); // Number of books per page
    const [totalPages, setTotalPages] = useState(1);

    const [no1, setNo] = useState(false);
    const [ret, setRet] = useState(false);
    const [ins, setIns] = useState(false);
    const [data, setData] = useState([]);
    const [up, setUp] = useState(false);
    const [bid, setBid] = useState('');
    const [del, setDel] = useState(false);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [year_published, setYearPublished] = useState('');

    useEffect(() => {
        if (ret) {
            getRetr();
        }
    }, [ret, currentPage]);

    function hanBid(event) { setBid(event.target.value); }
    function hanTitle(event) { setTitle(event.target.value); }
    function hanAuthor(event) { setAuthor(event.target.value); }
    function hanGenre(event) { setGenre(event.target.value); }
    function hanYearPublished(event) { setYearPublished(event.target.value); }

    function retrCl() { setRet(true); setNo(true); setCurrentPage(1); getRetr(); }
    function inser() { setIns(true); setNo(true); }
    function upd() { setUp(true); setNo(true); }
    function delop() { setDel(true); setNo(true); }

    function getRetr() {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;

        fetch('http://localhost:5014/RetrAll', {
            method: "get",
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then((data) => {
                setData(data.cont.slice(start, end)); // Slice data to display only the books for the current page
                setTotalPages(Math.ceil(data.cont.length / pageSize)); // Calculate total pages
            })
            .catch(error => { console.error(error); });
    }

    function goToPage(page) {
        setCurrentPage(page);
    }
    function InsData() {
        const postData = { bid, title, author, genre, year_published };
        fetch('http://localhost:5014/Insertion', {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        })
            .then(res => res.json())
            .then((data) => {
                window.alert(data.message);
            })
            .catch(error => {
                console.error(error);
            })
    }

    function UpdData() {
        const postData = { bid, title, author, genre, year_published };
        fetch('http://localhost:5014/Updation', {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        })
            .then(res => res.json())
            .then((data) => {
                window.alert(data.message);
            })
            .catch(error => {
                console.error(error);
            })
    }

    function DelData() {
        const postData = { bid };
        fetch('http://localhost:5014/Deletion', {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        })
            .then(res => res.json())
            .then((data) => {
                window.alert(data.message);
            })
            .catch(error => {
                console.error(error);
            })
    }

    function callIns() { InsData(); }
    function callUpd() { UpdData(); }
    function callDel() { DelData(); }

    function goBack() {
        setNo(false);
        setRet(false);
        setIns(false);
        setUp(false);
        setDel(false);
    }

    function logout() {
        onLogout();
    }

    return (
        <div className="container">
            {!no1 && (
                <div className="admin-card">
                    <button className="admin-button" onClick={retrCl}>Retrieve All</button>
                    <button className="admin-button" onClick={inser}>Insert</button>
                    <button className="admin-button" onClick={upd}>Update</button>
                    <button className="admin-button" onClick={delop}>Delete</button>
                    <button className="logout-button" onClick={logout}>Logout</button>
                </div>
            )}
            {ret && (
                <div className="admin-card">
                    <h3 className="admin-header">Books List</h3>
                    <div className="book-list">
                        {data.map((book) => (
                            <div key={book.bid} className="book-details">
                                <p><b>ID</b>: {book.bid}</p>
                                <p><b>Title</b>: {book.title}</p>
                                <p><b>Author</b>: {book.author}</p>
                                <p><b>Genre</b>: {book.genre}</p>
                                <p><b>Year Published</b>: {book.year_published}</p>
                            </div>
                        ))}
                    </div>
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                className="pagination-button"
                                onClick={() => goToPage(page)}
                                disabled={page === currentPage}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <button className="go-back-button" onClick={goBack}>Go Back</button>
                </div>
            )}

            {ins && (
                <div className="admin-card">
                    <h3 className="admin-header">Insert Book</h3>
                    <input className="admin-input" type='text' value={bid} onChange={hanBid} placeholder="ID" />
                    <input className="admin-input" type='text' value={title} onChange={hanTitle} placeholder="Title" />
                    <input className="admin-input" type='text' value={author} onChange={hanAuthor} placeholder="Author" />
                    <input className="admin-input" type='text' value={genre} onChange={hanGenre} placeholder="Genre" />
                    <input className="admin-input" type='text' value={year_published} onChange={hanYearPublished} placeholder="Year Published" />
                    <button className="admin-button" onClick={callIns}>Submit</button>
                    <button className="go-back-button" onClick={goBack}>Go Back</button>
                </div>
            )}
            {up && (
                <div className="admin-card">
                    <h3 className="admin-header">Update Book</h3>
                    <input className="admin-input" type='text' value={bid} onChange={hanBid} placeholder="ID" />
                    <input className="admin-input" type='text' value={title} onChange={hanTitle} placeholder="Title" />
                    <input className="admin-input" type='text' value={author} onChange={hanAuthor} placeholder="Author" />
                    <input className="admin-input" type='text' value={genre} onChange={hanGenre} placeholder="Genre" />
                    <input className="admin-input" type='text' value={year_published} onChange={hanYearPublished} placeholder="Year Published" />
                    <button className="admin-button" onClick={callUpd}>Update</button>
                    <button className="go-back-button" onClick={goBack}>Go Back</button>
                </div>
            )}
            {del && (
                <div className="admin-card">
                    <h3 className="admin-header">Delete Book</h3>
                    <input className="admin-input" type='text' value={bid} onChange={hanBid} placeholder="ID" />
                    <button className="admin-button" onClick={callDel}>Delete</button>
                    <button className="go-back-button" onClick={goBack}>Go Back</button>
                </div>
            )}
        </div>
    );
}

export default Admin;
