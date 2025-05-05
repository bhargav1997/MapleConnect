import React from 'react';
import SupportLayout from '../../components/support/SupportLayout';

const CommunityGuidelines = () => {
  return (
    <SupportLayout 
      title="Community Guidelines" 
      description="Our guidelines for maintaining a safe, respectful, and inclusive community."
    >
      <div className="prose prose-maple max-w-none">
        <p className="lead text-lg text-gray-600">
          At MapleConnect, we're building a platform where neighbors can connect, share, and build stronger communities together. 
          These guidelines help ensure that MapleConnect remains a safe, respectful, and inclusive space for everyone.
        </p>
        
        <div className="my-8 p-4 bg-maple-red/5 border-l-4 border-maple-red rounded-r-md">
          <h3 className="text-maple-red font-medium mb-2">Our Community Principles</h3>
          <p className="text-gray-700 mb-0">
            Be respectful, inclusive, honest, helpful, and responsible. These core principles guide all interactions on MapleConnect.
          </p>
        </div>

        <h2>Be Respectful</h2>
        <p>
          Treat others with respect, kindness, and empathy. Disagreements are natural, but always engage in constructive and civil discourse. 
          Personal attacks, harassment, hate speech, or discriminatory comments based on race, ethnicity, national origin, religion, gender, 
          gender identity, sexual orientation, age, disability, medical condition, or any other characteristic are not tolerated.
        </p>

        <h2>Be Inclusive</h2>
        <p>
          MapleConnect is for everyone in your community. Welcome new members, value diverse perspectives, and create an environment 
          where all neighbors feel they belong. Avoid exclusionary behavior or language that makes others feel unwelcome or uncomfortable.
        </p>

        <h2>Be Honest</h2>
        <p>
          Use your real identity and provide accurate information. Misrepresentation, impersonation, or creating fake accounts is prohibited. 
          When selling or exchanging items, provide accurate descriptions and honor your commitments. Building trust is essential for a 
          strong community.
        </p>

        <h2>Be Helpful</h2>
        <p>
          MapleConnect thrives when neighbors help each other. Share your knowledge, skills, and resources when you can. 
          Respond to requests for assistance in a timely and supportive manner. Recognize and appreciate when others help you.
        </p>

        <h2>Be Responsible</h2>
        <p>
          Take responsibility for your actions and content. Respect privacy and confidentiality. Don't share others' personal information 
          without permission. Report content that violates our guidelines. When organizing events or activities, prioritize safety and 
          follow local laws and regulations.
        </p>

        <h2>Prohibited Content and Behavior</h2>
        <ul>
          <li>
            <strong>Illegal activities:</strong> Content promoting or facilitating illegal activities is prohibited.
          </li>
          <li>
            <strong>Harassment and bullying:</strong> Targeted harassment, threats, intimidation, or bullying of individuals or groups is not allowed.
          </li>
          <li>
            <strong>Hate speech:</strong> Content that promotes hatred, violence, or discrimination against protected groups is prohibited.
          </li>
          <li>
            <strong>Misinformation:</strong> Deliberately spreading false information that could cause harm or panic is not allowed.
          </li>
          <li>
            <strong>Spam and solicitation:</strong> Excessive promotional content, unsolicited advertising, pyramid schemes, or multi-level marketing is prohibited.
          </li>
          <li>
            <strong>Adult content:</strong> Sexually explicit or pornographic material is not allowed on MapleConnect.
          </li>
          <li>
            <strong>Violent content:</strong> Graphic violence, gore, or content that glorifies violence is prohibited.
          </li>
          <li>
            <strong>Privacy violations:</strong> Sharing someone's private information without permission (doxxing) is prohibited.
          </li>
        </ul>

        <h2>Enforcement</h2>
        <p>
          We rely on community members to report content that violates these guidelines. Our moderation team reviews reports and takes 
          appropriate action, which may include:
        </p>
        <ul>
          <li>Removing the content</li>
          <li>Issuing a warning</li>
          <li>Temporarily restricting account capabilities</li>
          <li>Permanently suspending accounts for serious or repeated violations</li>
        </ul>

        <h2>Reporting Violations</h2>
        <p>
          If you see content that violates these guidelines, please report it by:
        </p>
        <ol>
          <li>Clicking the three dots (...) next to the content</li>
          <li>Selecting "Report"</li>
          <li>Choosing the appropriate reason for reporting</li>
          <li>Adding any additional details that might help our moderation team</li>
        </ol>

        <h2>Appeals</h2>
        <p>
          If you believe your content was removed in error or that a moderation action against your account was unwarranted, 
          you can appeal the decision by contacting our support team at <a href="mailto:support@mapleconnect.ca" className="text-maple-red hover:text-red-700">support@mapleconnect.ca</a>.
        </p>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-0">
            These guidelines may be updated periodically. We'll notify users of significant changes. 
            By using MapleConnect, you agree to follow these Community Guidelines.
          </p>
          <p className="text-sm text-gray-600 mb-0">
            Last updated: June 15, 2023
          </p>
        </div>
      </div>
    </SupportLayout>
  );
};

export default CommunityGuidelines;
