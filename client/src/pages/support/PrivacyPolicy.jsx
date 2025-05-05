import React from 'react';
import SupportLayout from '../../components/support/SupportLayout';

const PrivacyPolicy = () => {
  return (
    <SupportLayout 
      title="Privacy Policy" 
      description="How we collect, use, and protect your personal information."
    >
      <div className="prose prose-maple max-w-none">
        <p className="lead text-lg text-gray-600">
          At MapleConnect, we value your privacy and are committed to protecting your personal information. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
        </p>
        
        <div className="my-8 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-sm text-gray-600 mb-0">
            <strong>Effective Date:</strong> June 15, 2023<br />
            <strong>Last Updated:</strong> June 15, 2023
          </p>
        </div>

        <h2>Information We Collect</h2>
        
        <h3>Information You Provide to Us</h3>
        <p>We collect information you provide directly to us when you:</p>
        <ul>
          <li>Create or modify your account (name, email address, password, phone number)</li>
          <li>Complete your profile (profile picture, bio, interests, skills)</li>
          <li>Provide location information (address, postal code, neighborhood)</li>
          <li>Create or interact with content (posts, comments, messages)</li>
          <li>Create listings in the marketplace</li>
          <li>Create or RSVP to events</li>
          <li>Communicate with other users</li>
          <li>Contact our support team</li>
        </ul>

        <h3>Information We Collect Automatically</h3>
        <p>When you use our platform, we automatically collect certain information, including:</p>
        <ul>
          <li>Device information (IP address, browser type, operating system)</li>
          <li>Usage information (pages visited, time spent, actions taken)</li>
          <li>Location information (with your permission)</li>
          <li>Cookies and similar technologies</li>
        </ul>

        <h3>Information From Third Parties</h3>
        <p>
          We may receive information about you from third parties, such as:
        </p>
        <ul>
          <li>Social media platforms, if you choose to link your accounts</li>
          <li>Other users who invite you to join or mention you</li>
          <li>Partners who help us verify information</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Connect you with neighbors and local communities</li>
          <li>Personalize your experience</li>
          <li>Process transactions</li>
          <li>Send notifications, updates, and support messages</li>
          <li>Ensure safety and security</li>
          <li>Prevent fraud and enforce our policies</li>
          <li>Comply with legal obligations</li>
          <li>Analyze usage patterns to improve our platform</li>
        </ul>

        <h2>How We Share Your Information</h2>
        <p>We may share your information in the following circumstances:</p>
        
        <h3>With Other Users</h3>
        <p>
          When you use MapleConnect, your profile information and content you post are visible to other users according to your privacy settings. 
          Messages you send to other users are visible to the recipients.
        </p>

        <h3>With Service Providers</h3>
        <p>
          We share information with third-party service providers who help us operate our platform, such as cloud storage providers, 
          payment processors, email service providers, and analytics services.
        </p>

        <h3>For Legal Reasons</h3>
        <p>
          We may share information if required by law, legal process, or government request, or to protect the rights, property, 
          and safety of MapleConnect, our users, or the public.
        </p>

        <h3>With Your Consent</h3>
        <p>
          We may share information with third parties when you give us your consent to do so.
        </p>

        <h2>Your Choices and Rights</h2>
        <p>You have several choices regarding your information:</p>
        
        <h3>Account Information</h3>
        <p>
          You can update your account information and profile at any time through your account settings.
        </p>

        <h3>Privacy Settings</h3>
        <p>
          You can control who sees your profile and content through your privacy settings.
        </p>

        <h3>Communication Preferences</h3>
        <p>
          You can manage your notification and email preferences in your account settings.
        </p>

        <h3>Location Information</h3>
        <p>
          You can control location permissions through your device settings.
        </p>

        <h3>Cookies</h3>
        <p>
          Most web browsers are set to accept cookies by default. You can usually set your browser to remove or reject cookies.
        </p>

        <h3>Account Deletion</h3>
        <p>
          You can delete your account at any time through your account settings. Note that some information may be retained as required by law.
        </p>

        <h2>Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, 
          alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, 
          so we cannot guarantee absolute security.
        </p>

        <h2>Data Retention</h2>
        <p>
          We retain your information for as long as your account is active or as needed to provide you services, comply with legal obligations, 
          resolve disputes, and enforce our agreements.
        </p>

        <h2>Children's Privacy</h2>
        <p>
          MapleConnect is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. 
          If we learn we have collected personal information from a child under 13, we will delete that information.
        </p>

        <h2>International Data Transfers</h2>
        <p>
          Your information may be transferred to, and processed in, countries other than the country in which you reside. These countries may have 
          data protection laws that are different from the laws of your country.
        </p>

        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
          and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p>
          <strong>Email:</strong> <a href="mailto:privacy@mapleconnect.ca" className="text-maple-red hover:text-red-700">privacy@mapleconnect.ca</a><br />
          <strong>Address:</strong> 123 Maple Street, Toronto, ON M5V 2K4, Canada
        </p>
      </div>
    </SupportLayout>
  );
};

export default PrivacyPolicy;
