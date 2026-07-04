import { React, ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { Forms } from "@vendetta/ui/components";
import { showToast } from "@vendetta/ui/toasts";
import { BADGES_CATALOG, captureFromUserId } from "./index";

const { ScrollView, View, TextInput } = ReactNative;
const { FormSection, FormRow, FormSwitch, FormInput, FormDivider } = Forms;

export default function Settings() {
    useProxy(storage);
    const [captureId, setCaptureId] = React.useState("");

    return (
        <ScrollView style={{ flex: 1 }}>
            <FormSection title="✏️ fake name (only u see btw)">
                <FormInput
                    title="display name"
                    value={storage.displayName || ""}
                    placeholder="ur fake display name"
                    onChange={(v) => { storage.displayName = v; }}
                />
                <FormDivider />
                <FormInput
                    title="username"
                    value={storage.username || ""}
                    placeholder="urfakeuser"
                    onChange={(v) => { storage.username = v; }}
                />
            </FormSection>

            <FormSection title="📅 fake member since">
                <FormInput
                    title="date (YYYY-MM-DD)"
                    value={storage.fakeCreatedAt || ""}
                    placeholder="2015-05-13"
                    onChange={(v) => { storage.fakeCreatedAt = v; }}
                />
            </FormSection>

            <FormSection title="🎯 snag from user id">
                <FormInput
                    title="user id"
                    value={captureId}
                    placeholder="paste user id here..."
                    onChange={setCaptureId}
                />
                <FormRow
                    label="🎯 snag their badges"
                    onPress={() => {
                        if (!captureId || !/^\d{17,20}$/.test(captureId)) {
                            showToast("thats not a valid id lol", { type: 2 });
                            return;
                        }
                        captureFromUserId(captureId);
                    }}
                />
            </FormSection>

            <FormSection title="🏅 fake badges">
                {Object.entries(BADGES_CATALOG).map(([key, badge]) => (
                    <React.Fragment key={key}>
                        <FormRow
                            label={badge.description}
                            trailing={
                                <FormSwitch
                                    value={storage.activeBadges.includes(key)}
                                    onValueChange={(v) => {
                                        if (v) {
                                            storage.activeBadges = [...storage.activeBadges, key];
                                        } else {
                                            storage.activeBadges = storage.activeBadges.filter(k => k !== key);
                                        }
                                    }}
                                />
                            }
                        />
                        <FormDivider />
                    </React.Fragment>
                ))}
            </FormSection>
        </ScrollView>
    );
}
