import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm(props) {
  const [values, setValues] = useState(initialFormValues)
  // ✨ where are my props? Destructure them here - done
  const { postArticle, updateArticle, setCurrentArticleId, currentArticle, articles } = props

  useEffect(() => {
    // ✨ implement - done
    // Every time the `currentArticle` prop changes, we should check it for truthiness:
    // if it's truthy, we should set its title, text and topic into the corresponding
    // values of the form. If it's not, we should reset the form back to initial values.
    if (currentArticle) {
      // console.log(`there's a current article...`)
      let foundArticle = articles.find(obj => obj.article_id === currentArticle);
      setValues({ title: foundArticle.title, text: foundArticle.text, topic: foundArticle.topic })
    } else {
      // console.log(`there's no current article, use the default values...`)
      setValues(initialFormValues)
    }
  }, [currentArticle])

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value })
  }

  const onSubmit = evt => {
    evt.preventDefault()
    // ✨ implement - TODO
    // We must submit a new post or update an existing one,
    // depending on the truthyness of the `currentArticle` prop.
    if (currentArticle) {
      updateArticle({ "article_id": currentArticle, "article": {
        "title": values.title, 
        "text": values.text, 
        "topic": values.topic
      }})
      setValues(initialFormValues);
    } else {
      postArticle({
        "title": values.title,
        "text": values.text,
        "topic": values.topic
      });
      setValues(initialFormValues);
    }
  }

  const isDisabled = () => {
    // ✨ implement - done
    // Make sure the inputs have some values
    // console.log(`disabled`)
    // console.log(`values`, values)
    // console.log(`values`, values.title)
    // console.log(`values`, values.text)
    // console.log(`values`, values.topic)
    return !(values.title.trim().length >= 1 && values.text.trim().length >= 1 && values.topic.trim().length >= 1)
  }

  const handleCancel = () => {
    setCurrentArticleId(null);
    setValues(initialFormValues)
  }

  return (
    // ✨ fix the JSX: make the heading display either "Edit" or "Create" - TODO
    // and replace Function.prototype with the correct function
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticle ? "Edit Article" : "Create Article"}</h2>
      <input
        maxLength={50}
        onChange={onChange}
        value={values.title}
        placeholder="Enter title"
        id="title"
      />
      <textarea
        maxLength={200}
        onChange={onChange}
        value={values.text}
        placeholder="Enter text"
        id="text"
      />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
      {currentArticle ? 
          <>
            <button disabled={isDisabled()} id="submitArticle">Submit</button>
            <button onClick={ handleCancel }>Cancel edit</button> 
          </> 
        : 
          <button disabled={isDisabled()} id="submitArticle">Submit</button>
      }
      </div>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
