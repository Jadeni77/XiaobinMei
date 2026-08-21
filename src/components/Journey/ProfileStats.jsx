import "../../components_css/ProfileStats.css";
import CountUp from "../CountUp";
import {
  ArrowRightIcon,
  BookIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  MapPinIcon,
} from "../Icons";
import { courseCount, degree, workTermCount } from "../../data/education";
import { experience } from "../../data/experience";
import { site } from "../../data/site";

function ProfileStats() {
  // Counts derive from the data files so the tiles cannot drift.
  const stats = [
    {
      icon: GraduationCapIcon,
      value: "CS + Math",
      label: `${degree.note}, ${degree.school}`,
      href: "#education",
    },
    {
      icon: MapPinIcon,
      value: site.location,
      label: "Where I'm based",
    },
    {
      icon: BriefcaseIcon,
      // Co-ops and internships are work experience, not coursework.
      value: experience.length + workTermCount,
      label: "Roles, co-ops & programs",
      href: "#experience",
    },
    {
      icon: BookIcon,
      value: courseCount,
      label: "CS & Math courses",
      href: "#education",
    },
  ];

  return (
    <div className="profile-stats">
      {stats.map((stat) => {
        const { value, label, href } = stat;
        const Tile = href ? "a" : "div";
        const Icon = stat.icon;
        return (
          <Tile
            key={label}
            href={href}
            className={`card profile-stat ${
              href ? "profile-stat--link card--interactive" : ""
            }`}
          >
            <Icon className="profile-stat-icon" width="20" height="20" />
            <CountUp className="profile-stat-value" value={value} />
            <span className="profile-stat-label">{label}</span>
            {href && (
              <ArrowRightIcon className="profile-stat-arrow" width="16" height="16" />
            )}
          </Tile>
        );
      })}
    </div>
  );
}

export default ProfileStats;
