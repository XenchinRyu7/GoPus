import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";

export function ProfileInfoCard({ title, description, details, action }) {
  return (
    <Card color="transparent" shadow={false}>
      <CardBody className="p-0">
        {details && (
          <ul className="flex flex-col gap-4 p-0">
            {Object.keys(details).map((el, key) => (
              <li key={key} className="flex items-center gap-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-semibold capitalize"
                >
                  {el}:
                </Typography>
                {typeof details[el] === "string" ? (
                  <Typography
                    variant="small"
                    className="font-normal text-blue-gray-500"
                  >
                    {details[el]}
                  </Typography>
                ) : (
                  details[el]
                )}
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}

ProfileInfoCard.defaultProps = {
  action: null,
  description: null,
  details: {},
};

ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node,
  details: PropTypes.object,
};

ProfileInfoCard.displayName = "/src/widgets/cards/profile-info-card.jsx";

export default ProfileInfoCard;
