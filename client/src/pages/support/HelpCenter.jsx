import React, { useState } from 'react';
import SupportLayout from '../../components/support/SupportLayout';

const HelpCenter = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const helpSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'To create an account, click on the "Join now" button in the top right corner of the homepage. Fill in your email address, create a password, and provide your name and location. Verify your email address by clicking the link sent to your inbox, and you\'re ready to go!'
        },
        {
          question: 'How do I set up my profile?',
          answer: 'After creating your account, you\'ll be prompted to set up your profile. Add a profile picture, write a short bio, and specify your interests and skills. The more complete your profile is, the easier it will be to connect with neighbors who share your interests.'
        },
        {
          question: 'How do I find my neighborhood?',
          answer: 'MapleConnect uses your postal code to identify your neighborhood. You can adjust your neighborhood settings in your profile if needed. This helps us connect you with relevant local circles, events, and marketplace listings.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account & Profile',
      faqs: [
        {
          question: 'How do I change my password?',
          answer: 'To change your password, go to Settings > Security, then click on "Change Password." Enter your current password, then your new password twice to confirm. Click "Save Changes" to update your password.'
        },
        {
          question: 'How do I update my profile information?',
          answer: 'To update your profile, go to your profile page and click the "Edit Profile" button. From there, you can update your profile picture, bio, interests, skills, and other information. Don\'t forget to save your changes when you\'re done.'
        },
        {
          question: 'How do I control my privacy settings?',
          answer: 'Go to Settings > Privacy to control who can see your profile, posts, and personal information. You can choose from options like "Public," "Neighbors Only," or "Only Me" for different aspects of your profile.'
        },
        {
          question: 'How do I delete my account?',
          answer: 'To delete your account, go to Settings > Account, then scroll to the bottom and click "Delete Account." You\'ll need to confirm your password and understand that this action is permanent and cannot be undone.'
        }
      ]
    },
    {
      id: 'circles',
      title: 'Neighbourhood Circles',
      faqs: [
        {
          question: 'What are Neighbourhood Circles?',
          answer: 'Neighbourhood Circles are groups of neighbors who share common interests, goals, or locations. They provide a space for community members to connect, share information, organize events, and collaborate on local initiatives.'
        },
        {
          question: 'How do I create a Circle?',
          answer: 'To create a Circle, go to the Circles page and click "Create Circle." Fill in details like the Circle name, description, location, and privacy settings. You can then invite neighbors to join your Circle.'
        },
        {
          question: 'How do I join a Circle?',
          answer: 'You can join public Circles by visiting the Circle page and clicking "Join." For private Circles, you\'ll need to request to join, and a Circle admin will need to approve your request.'
        },
        {
          question: 'How do I manage a Circle as an admin?',
          answer: 'As a Circle admin, you can manage members, approve join requests, edit Circle information, create events, and moderate discussions. Access these features from the "Manage" tab on your Circle page.'
        }
      ]
    },
    {
      id: 'events',
      title: 'Local Gatherings',
      faqs: [
        {
          question: 'How do I create an event?',
          answer: 'To create an event, go to the Events page and click "Create Event." Fill in details like the event name, description, date, time, location, and attendance options. You can create events for the public or for specific Circles.'
        },
        {
          question: 'How do I find local events?',
          answer: 'The Events page shows events in your area. You can filter events by date, distance, category, or Circle. You can also see events you\'ve been invited to or are attending.'
        },
        {
          question: 'How do I RSVP to an event?',
          answer: 'To RSVP to an event, visit the event page and click "Going," "Maybe," or "Can\'t Go." The event organizer will be notified of your response, and the event will be added to your calendar if you select "Going" or "Maybe."'
        },
        {
          question: 'How do I cancel or reschedule an event I\'m hosting?',
          answer: 'If you need to cancel or reschedule an event you\'re hosting, go to the event page and click "Edit Event." From there, you can update the date and time or cancel the event. Attendees will be notified of any changes.'
        }
      ]
    },
    {
      id: 'marketplace',
      title: 'Local Exchange',
      faqs: [
        {
          question: 'How do I list an item for sale or exchange?',
          answer: 'To list an item, go to the Marketplace page and click "Create Listing." Add photos, a title, description, price (or indicate if it\'s free or for exchange), and your preferred pickup or delivery method.'
        },
        {
          question: 'How do I search for items in the Marketplace?',
          answer: 'Use the search bar and filters on the Marketplace page to find specific items. You can filter by category, price range, distance, and whether items are for sale, free, or exchange.'
        },
        {
          question: 'How do I contact a seller?',
          answer: 'When you find an item you\'re interested in, click "Contact Seller" on the listing page. This will open a message thread where you can discuss details with the seller.'
        },
        {
          question: 'How do I mark an item as sold?',
          answer: 'Once you\'ve sold an item, go to your listing and click "Mark as Sold." This will update the listing status and remove it from active searches, but keep it in your history for reference.'
        }
      ]
    }
  ];

  const filteredSections = searchQuery
    ? helpSections.map(section => ({
        ...section,
        faqs: section.faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(section => section.faqs.length > 0)
    : helpSections;

  return (
    <SupportLayout 
      title="Help Center" 
      description="Find answers to common questions about using MapleConnect."
    >
      {/* Search bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maple-red focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Section tabs */}
      {!searchQuery && (
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {helpSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeSection === section.id
                    ? 'border-maple-red text-maple-red'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* FAQ content */}
      <div className="space-y-12">
        {filteredSections.map((section) => (
          <div 
            key={section.id} 
            id={section.id}
            className={!searchQuery && activeSection !== section.id ? 'hidden' : ''}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.title}</h2>
            <div className="space-y-4">
              {section.faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredSections.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No results found</h3>
            <p className="mt-1 text-gray-500">We couldn't find any help articles matching your search.</p>
            <div className="mt-6">
              <button 
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-maple-red hover:bg-red-700"
              >
                Clear search
              </button>
            </div>
          </div>
        )}
      </div>
    </SupportLayout>
  );
};

export default HelpCenter;
