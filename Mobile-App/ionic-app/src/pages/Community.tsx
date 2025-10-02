import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonImg,
  IonTabButton,
  IonAvatar,
  IonTabBar,
  IonSearchbar,
  IonModal,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonCheckbox, IonBackButton, IonButtons
} from "@ionic/react";
import {
  trophy,
  chatboxEllipses,
  people,
  searchOutline,
  addOutline,
  calendarOutline,
  locationOutline, 
} from "ionicons/icons";
import ChallengePic from "../components/assets/istockphoto-143920084-612x612.jpg";
import ProfilePic from '../components/assets/close-up-portrait-serious-man-with-curly-hair.jpg';
import "../theme/Community.css"; // custom styles if needed

const Community: React.FC = () => {
  const [tab, setTab] = useState<"challenges" | "feed" | "groups">("challenges");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [challengeName, setChallengeName] = useState("");
  const [challengeDescription, setChallengeDescription] = useState("");

  return (
    <IonPage className="community-page">
      {/* Header */}
      <IonHeader className="community-header">
        <IonToolbar>
           <IonButtons slot="start">
            <IonBackButton defaultHref="/HomeModule/homeM1" />
          </IonButtons>
          <IonTitle>
           Community
            
          </IonTitle>
        </IonToolbar>

        {/* Segment Navigation */}
        <IonToolbar className="segment-toolbar">
          <IonSegment
            value={tab}
            onIonChange={(e) =>
              setTab((e.detail.value ?? "challenges") as
                | "challenges"
                | "feed"
                | "groups")
            }
            className="community-segment"
          >
            <IonSegmentButton value="challenges" className="segment-btn">
              <IonIcon icon={trophy} />
              <IonLabel>Challenges</IonLabel>
            </IonSegmentButton>

            <IonSegmentButton value="feed" className="segment-btn">
              <IonIcon icon={chatboxEllipses} />
              <IonLabel>Feed</IonLabel>
            </IonSegmentButton>

            <IonSegmentButton value="groups" className="segment-btn">
              <IonIcon icon={people} />
              <IonLabel>Group</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent className="community-content">
        {/* CHALLENGES tab */}
        {tab === "challenges" && (
          <div className="challenges-tab">
            {/* Search Bar */}
            <div className="search-container">
              <IonSearchbar
                placeholder="Search challenges"
                className="challenge-search"
              />
            </div>

            {/* Current Challenge */}
            <IonCard className="current-challenge-card">
              <div className="challenge-image-container">
                <IonImg src={ChallengePic} alt="Running Challenge" />
                <div className="challenge-overlay">
                  <h3 className="challenge-title">Running Challenge</h3>
                  <div className="participants">
                    <IonIcon icon={people} className="participants-icon" />
                    <span>1,341 participants</span>
                  </div>
                </div>
              </div>
              <IonCardContent className="challenge-content">
                <div className="progress-section">
                  <span className="progress-label">Current Progress: 65km</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: "65%" }}></div>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            {/* Create Challenge Button */}
            <IonButton
              expand="block"
              className="create-challenge-btn"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <IonIcon icon={addOutline} slot="start" />
              Add Photo
            </IonButton>

            {/* Suggested Challenges Section */}
            <div className="suggested-section">
              <h2 className="section-title">Suggested Challenge</h2>
              
              <IonCard className="suggested-challenge-card">
                <div className="challenge-image-container">
                  <IonImg src={ChallengePic} alt="April Elevation Challenge" />
                  <div className="suggested-overlay">
                    <IonButton size="small" className="join-challenge-btn">
                      Join Challenge
                    </IonButton>
                  </div>
                </div>
                <IonCardContent className="suggested-content">
                  <h3 className="suggested-title">April Elevation Challenge</h3>
                  <p className="suggested-description">
                    Climb a total of 2,000 m (6,561.7 ft) in a month.
                  </p>
                  <p className="suggested-date">Apr 1, 2025 to Apr 30, 2025</p>
                </IonCardContent>
              </IonCard>

              <IonCard className="suggested-challenge-card">
                <div className="challenge-image-container">
                  <IonImg src={ChallengePic} alt="April Run 300K Challenge" />
                  <div className="suggested-overlay">
                    <IonButton size="small" className="join-challenge-btn">
                      Join Challenge
                    </IonButton>
                  </div>
                </div>
                <IonCardContent className="suggested-content">
                  <h3 className="suggested-title">April Run 300K Challenge</h3>
                  <p className="suggested-description">
                    Run a total of 300 km (186.4 mi) in a month.
                  </p>
                  <p className="suggested-date">Apr 1, 2025 to Apr 30, 2025</p>
                </IonCardContent>
              </IonCard>
            </div>
          </div>
        )}

        {/* FEED tab */}
        {tab === "feed" && (
          <div className="feed-tab">
            {/* Post Creation Input */}
            <IonCard className="post-input-card">
              <IonItem lines="none">
                <IonAvatar slot="start">
                  <IonImg src={ProfilePic} />
                </IonAvatar>
                <input type="text" placeholder="What's on your mind?" className="post-input" />
              </IonItem>
            </IonCard>

            {/* Feed Posts */}
            <div className="feed-posts">
              {/* Post 1 */}
              <IonCard className="post-card">
                <IonCardHeader>
                  <div className="post-header">
                    <IonAvatar>
                      <IonImg src={ProfilePic} />
                    </IonAvatar>
                    <div className="user-info">
                      <span className="username">Adams Smith</span>
                      <span className="timestamp">3 hrs ago</span>
                    </div>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  <p className="post-text">Just completed my first 10K! 🏃 Feeling amazing!</p>
                  <IonImg src={ChallengePic} className="post-image" />
                  <div className="post-actions">
                    <div className="action-item">❤️ 324</div>
                    <div className="action-item">💬 43</div>
                  </div>
                </IonCardContent>
              </IonCard>

              {/* Post 2 */}
              <IonCard className="post-card">
                <IonCardHeader>
                  <div className="post-header">
                    <IonAvatar>
                      <IonImg src={ProfilePic} />
                    </IonAvatar>
                    <div className="user-info">
                      <span className="username">Adams Smith</span>
                      <span className="timestamp">3 hrs ago</span>
                    </div>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  <p className="post-text">Great run with the team today! Marathon training is on track! 🏃‍♀️🏃‍♂️</p>
                  <IonImg src={ChallengePic} className="post-image" />
                  <div className="post-actions">
                    <div className="action-item">❤️ 41</div>
                    <div className="action-item">💬 512</div>
                  </div>
                </IonCardContent>
              </IonCard>

              {/* Post 3 */}
              <IonCard className="post-card">
                <IonCardHeader>
                  <div className="post-header">
                    <IonAvatar>
                      <IonImg src={ProfilePic} />
                    </IonAvatar>
                    <div className="user-info">
                      <span className="username">Adams Smith</span>
                      <span className="timestamp">5 hrs ago</span>
                    </div>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  <p className="post-text">Morning jog in the park. So refreshing! 🌳</p>
                  <IonImg src={ChallengePic} className="post-image" />
                  <div className="post-actions">
                    <div className="action-item">❤️ 150</div>
                    <div className="action-item">💬 20</div>
                  </div>
                </IonCardContent>
              </IonCard>
            </div>
          </div>
        )}

        {/* GROUPS tab */}
        {tab === "groups" && (
          <div className="groups-tab">
            <div className="groups-header">
              <IonButton className="find-groups-btn">Find Groups</IonButton>
              <IonSearchbar placeholder="Search groups..." className="group-search" />
            </div>

            <div className="groups-section">
              <h2 className="section-title">Suggested Groups</h2>

              <div className="group-list">
                <IonCard className="group-card">
                  <IonImg src={ChallengePic} alt="Trail Runners Group" />
                  <IonCardContent className="group-overlay">
                    <span className="group-name">Trail Runners</span>
                    <IonButton size="small" className="join-group-btn">Join</IonButton>
                  </IonCardContent>
                </IonCard>

                <IonCard className="group-card">
                  <IonImg src={ChallengePic} alt="Sprint Team Group" />
                  <IonCardContent className="group-overlay">
                    <span className="group-name">Sprint Team</span>
                    <IonButton size="small" className="join-group-btn">Join</IonButton>
                  </IonCardContent>
                </IonCard>

                <IonCard className="group-card">
                  <IonImg src={ChallengePic} alt="Yoga Enthusiasts Group" />
                  <IonCardContent className="group-overlay">
                    <span className="group-name">Yoga Enthusiasts</span>
                    <IonButton size="small" className="join-group-btn">Join</IonButton>
                  </IonCardContent>
                </IonCard>
              </div>
              <h2 className="section-title">Your Group</h2>
              <div className="group-list">
                <IonCard routerLink="/group-feed" className="group-card">
                  <IonImg src={ChallengePic} alt="Trail Runners Group" />
                  <IonCardContent className="group-overlay">
                    <span className="group-name">Trail Runners</span>
                  </IonCardContent>
                </IonCard>
              </div>
            </div>
          </div>
        )}

        {/* Create Challenge Modal */}
        <IonModal isOpen={isCreateModalOpen} onDidDismiss={() => setIsCreateModalOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Create Challenge</IonTitle>
              <IonButton 
                slot="end" 
                fill="clear" 
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent className="modal-content">
            <div className="create-form">
              <IonItem>
                <IonLabel position="stacked">Challenge Name</IonLabel>
                <IonInput
                  value={challengeName}
                  onIonInput={e => setChallengeName(e.detail.value!)}
                  placeholder="Enter challenge name"
                />
              </IonItem>
              
              <IonItem>
                <IonLabel position="stacked">Description</IonLabel>
                <IonTextarea
                  value={challengeDescription}
                  onIonInput={e => setChallengeDescription(e.detail.value!)}
                  placeholder="Describe your challenge"
                  rows={4}
                />
              </IonItem>

              <div className="form-actions">
                <IonButton 
                  expand="block" 
                  className="create-challenge-final-btn"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Create Challenge
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Community;