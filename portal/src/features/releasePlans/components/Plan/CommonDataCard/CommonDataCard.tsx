import { Card, CardContent, Typography } from "@mui/material";

export type CommonDataCardProps = {
  owner: string;
  startDate: string;
  endDate: string;
  id: string;
};

export default function CommonDataCard({
  owner,
  startDate,
  endDate,
  id,
}: CommonDataCardProps) {
  const data = [
    { label: "Owner", value: owner },
    { label: "Start Date", value: startDate },
    { label: "End Date", value: endDate },
    { label: "ID", value: id },
  ];

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" component="div">
          Common Data
        </Typography>
        {data.map((item) => (
          <Typography key={item.label} variant="body2" color="text.secondary">
            {item.label}: {item.value}
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
}


