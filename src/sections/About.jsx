import React from 'react';
import Section from '../components/Section';
import profilePic from '../assets/profile-pic.jpg';
import sap from '../assets/sap.png';
import Acog from '../assets/Acog.png';
import Microsoft365 from '../assets/365.png';
import BI from '../assets/BI.png';
import python from '../assets/python.png';
import sql from '../assets/sql.png';
import salesforce from '../assets/salesforce.png';
import zendesk from '../assets/zendesk.png';
import slack from '../assets/slack.png';
import discord from '../assets/discord.png';
import smartsheet from '../assets/smartsheet.png';
import workspace from '../assets/workspace.png';
import jira from '../assets/jira.png';
import confluence from '../assets/confluence.png';
import zoom from '../assets/zoom.png';
import notion from '../assets/notion.png';
import clickup from '../assets/clickup.png';
import miro from '../assets/miro.png';


const About = () => {
  // Array of tech stack items
  const techStack = [
    { name: "SAP", image: sap },
    { name: "Admin Center", image: Acog },
    { name: "Microsoft 365", image: Microsoft365 },
    { name: "Microsoft PowerBi", image: BI },
    { name: "Python", image: python },
    { name: "SQL", image: sql },
    { name: "Salesforce", image: salesforce },
    { name: "Zendesk", image: zendesk },
    { name: "Slack", image: slack },
    { name: "Discord", image: discord },
    { name: "Smartsheet", image: smartsheet },
    { name: "Google Workspace", image: workspace },
    { name: "Jira", image: jira },
    { name: "Confluence", image: confluence },
    { name: "Zoom", image: zoom },
    { name: "Notion", image: notion },
    { name: "Clickup", image: clickup },
    { name: "Miro", image: miro }
  ];

  return (
    <Section id="profile" className='bg-black'>
      <div className="grid items-center gap-12 md:grid-cols-5 lg:gap-16">
        {/* Image */}
        <div className="flex justify-center md:col-span-2 md:justify-end">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -left-4 -top-4 h-full w-full rounded-lg bg-white/10 blur-3xl"></div>
            
            {/* Image */}
            <img 
              src={profilePic} 
              alt="Magnus Isaac" 
              className="relative h-auto w-full max-w-sm rounded-lg object-cover shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
              // style={{ boxShadow: '0 10px 30px -15px rgba(59, 130, 246, 0.5)' }}
            />
            
            {/* Decorative elements */}
            <div className="absolute -bottom-3 -right-3 h-24 w-24 rounded-br-lg border-b-4 border-r-4 border-white"></div>
          </div>
        </div>
        
        {/* Text */}
        <div className="md:col-span-3">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            About Me
          </h2>
          
          <div className="space-y-4 text-base leading-relaxed text-white/75 md:text-lg">
              <p>Emerging business analytics professional with extensive customer experience management background, seeking growth opportunities in developing organizations. Combines analytical expertise with strong problem-solving skills acquired through diverse roles in payment resolution, operations, and software development. Consistently exceeds targets through meticulous organization and prioritization, delivering high-quality results under pressure. Translates complex data into actionable insights with excellent communication skills, supporting data-driven decision-making across various professional settings.</p>
          </div>
          
          {/* Resume Link */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white bg-swhite/20 px-8 py-3 text-xs font-medium uppercase tracking-wider text-white transition duration-300 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            View My Resume
          </a>
        </div>
      </div>
      
      {/* My Stack Section - as a separate section */}
      <div className="mt-16 pt-12 border-t border-slate-700/30">
        <h2 className="mb-5 text-3xl font-bold text-white">
          My Technical Stack
        </h2>
        
        <div className="mb-6 text-base leading-relaxed text-white/75 md:text-lg">
          <p>I leverage a versatile set of technologies to build robust and efficient solutions, allowing me to approach problems from multiple angles. Below are the key technologies I work with regularly:</p>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-8">
          {techStack.map((tech, index) => (
            <div 
              key={index} 
              className="group flex items-center justify-center rounded-md border border-slate-700/50 bg-slate-800/50 p-2 transition-all duration-300 hover:border-blue-500/50 hover:bg-blue-500/10"
              title={tech.name}
            >
              <img 
                src={tech.image} 
                alt={tech.name} 
                className="h-10 transition-transform duration-300 group-hover:scale-110" 
              />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default About;