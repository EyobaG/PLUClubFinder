import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../style/ClubListPage.css';
import '../style/Accordion.css';

// Function to fetch filtered data
const fetchData = async (url, setState, errorMessage, quizAnswers) => {
  try {
    const response = await fetch(url, {
      method: 'POST', // Send a POST request
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify(quizAnswers), // Send the quiz answers in the request body
    });

    if (!response.ok) {
      throw new Error(errorMessage);
    }

    // Read the response as text first (for debugging)
    const responseText = await response.text();
    console.log('Response Text:', responseText);

    // Try parsing the response as JSON if it's valid
    const data = JSON.parse(responseText); // Manually parse the JSON

    //const data = await response.json();
    setState(data); // Update state with the received data
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Main FilteredList Component
const FilteredList = () => {
  const location = useLocation(); // Access location object
  const { answers } = location.state || {};

  const [activeIndex, setActiveIndex] = useState(null);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch filtered club data based on quiz answers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/quiz-answers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(answers), // Send the quiz answers to the server
        });

        if (!response.ok) {
          throw new Error('Error fetching clubs data');
        }

        const data = await response.json();
        setClubs(data); // Set the fetched clubs data to state
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    if (answers) {
      fetchData(); // Only fetch if `answers` are available
    }
  }, [answers]);

  const toggleAccordion = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  // Handle loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="filtered-list-page">
      <h1>Your Results!</h1>
      <div className="accordion">
        {clubs.map((club, index) => (
          <div key={`${club.ClubID}-${index}`} className="accordion-item">
            <div className="accordion-header" onClick={() => toggleAccordion(index)}>
              {club.ClubName}, {club.ClubID}
            </div>
            {activeIndex === index && (
              <div className="accordion-content">

                {/* Description */}
                {club.Description && club.Description !== 'NULL' ? (
                  <p>{club.Description}</p>
                ) : (
                  <p><i>No description available right now. Try contacting the club's leaders for more information!</i></p>
                )}

                {/* Club Contact */}
                {club?.ClubContact
                    && club.ClubContact !== "NULL"
                    && club.ClubContact !== club.OfficerContact 
                    && (<p><strong><u>Club Contact:</u></strong> <a href={`mailto:${club.ClubContact}`}><i>{club.ClubContact}</i></a></p>)
                  }

                  {/* Club President */}
                  {club?.PresidentEmail
                    && club.PresidentEmail !== "NULL"
                    && (<p><strong><u>Club President:</u></strong> <a href={`mailto:${club.PresidentEmail}`}><i>{club.PresidentEmail}</i></a></p>)
                  }

                  {/* Websites 
                  { (website?.URL || instagram?.URL) && (
                      <p><strong><u>Websites:</u> </strong>
                        {instagram?.URL && <a href={instagram.URL} target="_blank" rel="noopener noreferrer"><i>Instagram</i></a>}
                        {website?.URL && instagram?.URL && ', '}
                        {website?.URL && <a href={website.URL} target="_blank" rel="noopener noreferrer"><i>Club Site</i></a>}
                        
                      </p>
                  )}*/}
                                
                  <div className="club-list-page-left">

                    {/* Meeting Times 
                    {allMeetingTimes.length > 0 ? (
                      <div>
                        <strong><u>Meeting Times (subject to change)</u></strong>
                        <ul>
                          {allMeetingTimes.map((time, idx) => (
                            <li key={idx}>
                              <strong>{time.DayOfWeek}</strong> - {convertTime(time.StartTime)} to {convertTime(time.EndTime)} @ {time.Location}
                            </li>
                          ))}
                        </ul>
                      </div>
                      ) : (
                        <div className="club-list-page">
                          <i>Meeting times are not currently available for this club.</i>
                        </div>
                      )
                    }*/}

                  </div> {/* club-list-page-left */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilteredList;
