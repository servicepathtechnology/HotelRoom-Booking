import React, { useState, useEffect } from 'react';
import { User, MessageSquare, DollarSign, CheckCircle, Database, Phone, ArrowRight } from 'lucide-react';
import './DemoWorkflow.css';

const steps = [
  { id: 1, icon: <User size={32} />, title: 'User Visits', desc: 'Guest lands on Modern Booking Site' },
  { id: 2, icon: <MessageSquare size={32} />, title: 'Smart Assistant', desc: 'Chatbot suggests personalized rooms' },
  { id: 3, icon: <DollarSign size={32} />, title: 'Dynamic Price', desc: 'System adjusts rate (+20% for weekend)' },
  { id: 4, icon: <CheckCircle size={32} />, title: 'Auto Booking', desc: 'Payment and Room reservation confirmed' },
  { id: 5, icon: <Database size={32} />, title: 'CRM Lead', desc: 'Guest profile saved in operations DB' },
  { id: 6, icon: <Phone size={32} />, title: 'WhatsApp Push', desc: 'Simulation of mobile confirmation' },
];

const DemoWorkflow = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % (steps.length + 1));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="workflow-page container">
      <div className="workflow-header">
        <h1>System Automation Workflow</h1>
        <p>A high-level view of what happens behind the scenes during a booking.</p>
      </div>

      <div className="workflow-container">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div className={`workflow-node ${activeStep >= idx + 1 ? 'active' : ''} ${activeStep === idx + 1 ? 'pulsing' : ''}`}>
              <div className="node-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
            
            {idx < steps.length - 1 && (
              <div className={`workflow-arrow ${activeStep > idx + 1 ? 'active' : ''}`}>
                <ArrowRight size={24} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      <div className="workflow-controls">
        <button 
          className="btn btn-outline" 
          onClick={() => setActiveStep(0)}
        >
          Restart Animation
        </button>
      </div>
    </div>
  );
};

export default DemoWorkflow;
