import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

import Protected from './Protected'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

import axios from 'axios'
// import { axiosWithAuth } from '../axios'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()

  const redirectToLogin = () => { 
    /* ✨ implement */ 
    navigate("/");
  }

  const redirectToArticles = () => { 
    /* ✨ implement */ 
    navigate("/articles");
  }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token")
    }
    setMessage("Goodbye!")
    redirectToLogin();
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    let fetchedToken = ""
    setMessage("");
    setSpinnerOn(true);

    axios.post(loginUrl, { username: username, password: password })
      .then(res => {
        fetchedToken = res.data["token"];
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        localStorage.setItem("token", fetchedToken);
        setMessage(`Here are your articles, ${username}!`)
        redirectToArticles();
        setSpinnerOn(false);
      })

  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    const token = localStorage.getItem("token");

    setMessage("");
    setSpinnerOn(true);

    axios.get(articlesUrl, {
      headers: {
        authorization: token,
      }
    })
      .then(res => {
        setArticles(res.data.articles)
        setMessage(res.data.message)
      })
      .catch(err => {
        if (err.response.status === 401) {
          console.log(`401 error => redirecting to login`)
          redirectToLogin();
          setSpinnerOn(false);
        }
      })
      .finally(() => {
        setSpinnerOn(false);
      })
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    const token = localStorage.getItem("token");
    setMessage("");
    setSpinnerOn(true);
    
    axios.post(articlesUrl, article, {
      headers: {
        authorization: token,
      }
    })
      .then(res => {
        setArticles(articles => [...articles, res.data.article])
        setMessage(res.data.message)
      })
      .catch(err => {
        if (err.response.status === 401) {
          console.log(`401 error => redirecting to login`)
          redirectToLogin();
          setSpinnerOn(false);
        } else { 
          console.error(err)
          setSpinnerOn(false);
        }
      })
      .finally(() => {
        setSpinnerOn(false);
      })
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    setMessage("");
    setSpinnerOn(true);
    const token = localStorage.getItem("token");
    // console.log(`token:`,token)
    // const articleUrl = articlesUrl + `/:${article_id}`;
    // console.log(articleUrl)
    // console.log(`article:`,article)
    
    axios.put(`${articlesUrl}/${article_id}`, article, {
      headers: {
        authorization: token,
      }
    })
      .then(res => {
        console.log(res)
        // setArticles(articles => [...articles, res.data.article])
        setArticles(articles => articles.map(item => item.article_id === article_id ? ({"article_id": article_id, ...article}) : item));
        setMessage(res.data.message)
        setCurrentArticleId(null)
      })
      .catch(err => {
        if (err.response.status === 401) {
          console.log(`401 error => redirecting to login`)
          redirectToLogin();
          setSpinnerOn(false);
        } else { 
          console.error(err)
          setSpinnerOn(false);
        }
      })
      .finally(() => {
        setSpinnerOn(false);
      })
  }

  const deleteArticle = article_id => {
    // ✨ implement
    console.log(`called deleteArticle...`)
    console.log(article_id);

    setMessage("");
    setSpinnerOn(true);
    const token = localStorage.getItem("token");
    axios.delete(`${articlesUrl}/${article_id}`, {
      headers: {
        authorization: token,
      }
    })
    .then(res => {
      console.log(res)
      // setArticles(articles => [...articles, res.data.article])
      setArticles(articles => articles.filter(item => item.article_id !== article_id));
      setMessage(res.data.message)
      // setCurrentArticleId(null)
    })
    .catch(err => {
      if (err.response.status === 401) {
        console.log(`401 error => redirecting to login`)
        redirectToLogin();
        setSpinnerOn(false);
      } else { 
        console.error(err)
        setSpinnerOn(false);
      }
    })
    .finally(() => {
      setSpinnerOn(false);
    })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={ spinnerOn } />
      <Message message={ message }/>
      <button id="logout" onClick={ logout }>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={ login } />} />
          <Route path="/articles" element={
            <Protected token={localStorage.getItem("token")}>
              <ArticleForm  
                postArticle={ postArticle }
                updateArticle={ updateArticle }
                setCurrentArticleId={ setCurrentArticleId }
                currentArticle={ currentArticleId }
                articles={articles}
              />
              <Articles 
                articles={ articles }
                getArticles={ getArticles }
                deleteArticle={ deleteArticle }
                setCurrentArticleId={ setCurrentArticleId }
                currentArticleId={ currentArticleId }
              />
            </Protected>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}