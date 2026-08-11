import styles from "./InformationCard.module.css";

type InformationCardProps = {
  children: React.ReactNode;
};

export default function InformationCard({ children }: InformationCardProps) {
  return <div className={styles.information}>{children}</div>;
}
