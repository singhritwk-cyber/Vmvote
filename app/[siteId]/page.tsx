"use client";

import React from "react";
import { useParams } from "next/navigation";
import VoteInnerPage from "../../components/VoteInnerPage";

export default function DynamicSitePage() {
  const params = useParams();
  const siteId = params?.siteId as string;

  // Render the inner instruction page
  return <VoteInnerPage siteId={siteId || "site1"} />;
}
