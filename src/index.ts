import { getWorldHeritageSites } from "./destination_data/web_data/unescoSites";
import {
  URLSForWorldHeritageSites,
} from "./destination_data/web_data/utils/constants";
import { scrapeDataWithRateLimits } from "./destination_data/web_data/utils/scrapeData";

scrapeDataWithRateLimits(URLSForWorldHeritageSites, getWorldHeritageSites);
