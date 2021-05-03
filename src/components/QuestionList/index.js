import React, { useEffect, useState } from 'react';
import './styles.css';
import axios from 'axios';

const QuestionList = () => {
    
    const [questions, updateQuestions] = useState([]); //state for the questions from the api
    const[loading, setLoading] = useState(true); //will be used for conditional rendering of question list
    const[addingNewElement, setAddingNewElement] = useState(false); //will be used for conditional rendering of input box
    const[newQuestion, setNewQuestion] = useState("");

    //this hook will behave as componentDidMount due to [] as sencond argument
    useEffect(async () => {
        const response = await axios.get('http://127.0.0.1:8000/api/questions/all/');
        const data = await response.data;
        updateQuestions([]); //avoids state having multiple equals elements due to re-rendering(ex: everytime I save my code)
        data.map(q => 
            updateQuestions(prevQuestions => [
                ...prevQuestions, 
                {id: q.id, question_text: q.question_text, pub_date: q.pub_date}
            ])
        );
        setLoading(false);

    }, []);


    const handleChange = (e) => {
        const newQuestion = e.target.value;
        setNewQuestion(newQuestion);
    } 

    const addElement = async() => {
        if(addingNewElement) { //if we have input box open, meaning adding === true
            const question = { 
                question_text: newQuestion,
                pub_date: null,
            };
            axios.post('http://127.0.0.1:8000/api/questions/add/', question)
            .then(res => console.log(res))
            .catch(err => console.error(err));
            window.location.reload(false);
        }
        setAddingNewElement(!addingNewElement); //flips whenever add element is called, so you can render and not render based on the state
    };

    //function for deleting questions, receives the question id as param
    const deleteQuestion = (questionID) => {
        console.log("id: " + questionID);
        axios.delete(`http://127.0.0.1:8000/api/questions/delete/${questionID}/`);
        window.location.reload(false);
    }

    return (
        <div className="questions-component">
            <h2>Current Polls</h2>
            {loading ? <div>...loading</div> :
                    <div className="questions-list">
                        {questions.map(
                            element => <div className="question">
                                {element.question_text}
                                <button>Edit</button>
                                <button onClick={() => deleteQuestion(element.id)}>Delete</button>
                            </div>
                        )}
                    </div>
            }
            
            {addingNewElement === false ? <button onClick={addElement}>Add element</button> :
                <div>
                    <fieldset>
                        <legend>Create a new poll</legend>
                        <label for="question">Question:</label>
                        <input type="text" name="question" id="question" onChange={handleChange}></input>
                        <button onClick={addElement}>Done</button>
                    </fieldset>
                </div>
            }
        </div>
    );
    
}

export default QuestionList;