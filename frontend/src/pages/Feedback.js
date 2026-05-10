import React, { useState, useEffect } from 'react';
import { feedbackService, employeeService } from '../services/apiService';
import '../styles/feedback.css';

function Feedback() {
  const [formData, setFormData] = useState({
    employee: '',
    title: '',
    content: '',
    rating: 5,
    feedbackType: 'constructive',
    isAnonymous: false
  });
  const [employees, setEmployees] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('give');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, feedRes] = await Promise.all([
          employeeService.getAllEmployees(),
          feedbackService.getAllFeedback()
        ]);
        setEmployees(empRes.data.data.filter(emp => emp._id !== user.id));
        setFeedbackList(feedRes.data.data);
      } catch (err) {
        setError('Failed to fetch data');
      }
    };

    fetchData();
  }, [user.id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await feedbackService.giveFeedback({
        ...formData,
        rating: parseInt(formData.rating)
      });
      setSuccess('Feedback submitted successfully!');
      setFormData({
        employee: '',
        title: '',
        content: '',
        rating: 5,
        feedbackType: 'constructive',
        isAnonymous: false
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-container">
      <h1>Feedback & Reviews</h1>

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'give' ? 'active' : ''}`}
          onClick={() => setActiveTab('give')}
        >
          Give Feedback
        </button>
        <button 
          className={`tab-btn ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          View Feedback
        </button>
      </div>

      {activeTab === 'give' && (
        <div className="give-feedback">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Employee *</label>
              <select
                name="employee"
                value={formData.employee}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Employee --</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Feedback Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Great team collaboration"
                required
              />
            </div>

            <div className="form-group">
              <label>Feedback Type *</label>
              <select
                name="feedbackType"
                value={formData.feedbackType}
                onChange={handleChange}
              >
                <option value="positive">Positive</option>
                <option value="constructive">Constructive</option>
                <option value="suggestion">Suggestion</option>
              </select>
            </div>

            <div className="form-group">
              <label>Rating (1-5) *</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Below Average</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>

            <div className="form-group">
              <label>Feedback Content *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Provide detailed feedback..."
                rows="5"
                required
              />
            </div>

            <div className="form-group checkbox">
              <input
                type="checkbox"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleChange}
              />
              <label>Submit Anonymously</label>
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'view' && (
        <div className="view-feedback">
          <h2>Feedback Received</h2>
          {feedbackList.length === 0 ? (
            <p>No feedback yet</p>
          ) : (
            <div className="feedback-list">
              {feedbackList.map(fb => (
                <div key={fb._id} className="feedback-item">
                  <div className="feedback-header">
                    <h3>{fb.title}</h3>
                    <span className={`feedback-type ${fb.feedbackType}`}>
                      {fb.feedbackType}
                    </span>
                  </div>
                  <div className="feedback-meta">
                    <span>Rating: {'⭐'.repeat(fb.rating)}</span>
                    {!fb.isAnonymous && <span>From: {fb.givenBy?.firstName}</span>}
                  </div>
                  <p>{fb.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Feedback;
