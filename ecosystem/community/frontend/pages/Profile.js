import { useEffect, useState } from "react";
import "./Profile.css";

const Profile = ({ currentUser }) => {
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        bio: "",
        location: "",
        website: "",
        skills: [],
        github: "",
        twitter: "",
        linkedin: "",
        isMentor: false,
        mentorshipAreas: [],
    });
    const [editing, setEditing] = useState(false);
    const [newSkill, setNewSkill] = useState("");
    const [newMentorshipArea, setNewMentorshipArea] = useState("");

    useEffect(() => {
        if (currentUser) {
            setProfileData({
                firstName: currentUser.firstName || "",
                lastName: currentUser.lastName || "",
                bio: currentUser.bio || "",
                location: currentUser.location || "",
                website: currentUser.website || "",
                skills: currentUser.skills || [],
                github: currentUser.github || "",
                twitter: currentUser.twitter || "",
                linkedin: currentUser.linkedin || "",
                isMentor: currentUser.isMentor || false,
                mentorshipAreas: currentUser.mentorshipAreas || [],
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfileData({
            ...profileData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleAddSkill = () => {
        if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
            setProfileData({
                ...profileData,
                skills: [...profileData.skills, newSkill.trim()],
            });
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setProfileData({
            ...profileData,
            skills: profileData.skills.filter(
                (skill) => skill !== skillToRemove
            ),
        });
    };

    const handleAddMentorshipArea = () => {
        if (
            newMentorshipArea.trim() &&
            !profileData.mentorshipAreas.includes(newMentorshipArea.trim())
        ) {
            setProfileData({
                ...profileData,
                mentorshipAreas: [
                    ...profileData.mentorshipAreas,
                    newMentorshipArea.trim(),
                ],
            });
            setNewMentorshipArea("");
        }
    };

    const handleRemoveMentorshipArea = (areaToRemove) => {
        setProfileData({
            ...profileData,
            mentorshipAreas: profileData.mentorshipAreas.filter(
                (area) => area !== areaToRemove
            ),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // In a real implementation, this would be an API call to update the profile
        console.log("Profile updated:", profileData);
        setEditing(false);
    };

    if (!currentUser) {
        return (
            <div className="profile-page">
                <div className="profile-container">
                    <p>Please log in to view your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        <div className="avatar-placeholder">
                            {profileData.firstName?.charAt(0)}
                            {profileData.lastName?.charAt(0)}
                        </div>
                    </div>
                    <div className="profile-basic-info">
                        <h1>
                            {profileData.firstName} {profileData.lastName}
                        </h1>
                        <p className="username">@{currentUser.username}</p>
                        <div className="reputation-badge">
                            <span>Reputation: {currentUser.reputation}</span>
                            {currentUser.badges &&
                                currentUser.badges.map((badge) => (
                                    <span key={badge} className="badge">
                                        {badge}
                                    </span>
                                ))}
                        </div>
                    </div>
                </div>

                {editing ? (
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-section">
                            <h2>Basic Information</h2>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="firstName">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={profileData.firstName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={profileData.lastName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="bio">Bio</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={profileData.bio}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="location">Location</label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={profileData.location}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="website">Website</label>
                                    <input
                                        type="url"
                                        id="website"
                                        name="website"
                                        value={profileData.website}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h2>Skills</h2>
                            <div className="skills-input">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) =>
                                            setNewSkill(e.target.value)
                                        }
                                        placeholder="Add a skill"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddSkill}
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="skills-list">
                                    {profileData.skills.map((skill) => (
                                        <span key={skill} className="skill-tag">
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveSkill(skill)
                                                }
                                                className="remove-skill"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h2>Social Links</h2>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="github">GitHub</label>
                                    <input
                                        type="text"
                                        id="github"
                                        name="github"
                                        value={profileData.github}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="twitter">Twitter</label>
                                    <input
                                        type="text"
                                        id="twitter"
                                        name="twitter"
                                        value={profileData.twitter}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="linkedin">LinkedIn</label>
                                    <input
                                        type="text"
                                        id="linkedin"
                                        name="linkedin"
                                        value={profileData.linkedin}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h2>Mentorship</h2>
                            <div className="form-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="isMentor"
                                        checked={profileData.isMentor}
                                        onChange={handleChange}
                                    />
                                    I'm available as a mentor
                                </label>
                            </div>
                            {profileData.isMentor && (
                                <div className="mentorship-areas">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            value={newMentorshipArea}
                                            onChange={(e) =>
                                                setNewMentorshipArea(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Add a mentorship area"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddMentorshipArea}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="mentorship-areas-list">
                                        {profileData.mentorshipAreas.map(
                                            (area) => (
                                                <span
                                                    key={area}
                                                    className="skill-tag"
                                                >
                                                    {area}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveMentorshipArea(
                                                                area
                                                            )
                                                        }
                                                        className="remove-skill"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="save-btn">
                                Save Changes
                            </button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setEditing(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="profile-view">
                        <div className="profile-section">
                            <div className="section-header">
                                <h2>About</h2>
                                <button
                                    className="edit-btn"
                                    onClick={() => setEditing(true)}
                                >
                                    Edit
                                </button>
                            </div>
                            {profileData.bio && <p>{profileData.bio}</p>}
                            <div className="profile-details">
                                {profileData.location && (
                                    <p>📍 {profileData.location}</p>
                                )}
                                {profileData.website && (
                                    <p>
                                        🔗{" "}
                                        <a
                                            href={profileData.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {profileData.website}
                                        </a>
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="profile-section">
                            <h2>Skills</h2>
                            <div className="skills-display">
                                {profileData.skills.length > 0 ? (
                                    profileData.skills.map((skill) => (
                                        <span key={skill} className="skill-tag">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p>No skills added yet.</p>
                                )}
                            </div>
                        </div>

                        <div className="profile-section">
                            <h2>Social Links</h2>
                            <div className="social-links">
                                {profileData.github && (
                                    <a
                                        href={`https://github.com/${profileData.github}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        GitHub
                                    </a>
                                )}
                                {profileData.twitter && (
                                    <a
                                        href={`https://twitter.com/${profileData.twitter}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Twitter
                                    </a>
                                )}
                                {profileData.linkedin && (
                                    <a
                                        href={`https://linkedin.com/in/${profileData.linkedin}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        LinkedIn
                                    </a>
                                )}
                            </div>
                        </div>

                        {profileData.isMentor && (
                            <div className="profile-section">
                                <h2>Mentorship</h2>
                                <p>Available as a mentor</p>
                                {profileData.mentorshipAreas.length > 0 && (
                                    <div className="mentorship-areas-display">
                                        <h3>Areas of Expertise</h3>
                                        {profileData.mentorshipAreas.map(
                                            (area) => (
                                                <span
                                                    key={area}
                                                    className="skill-tag"
                                                >
                                                    {area}
                                                </span>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
