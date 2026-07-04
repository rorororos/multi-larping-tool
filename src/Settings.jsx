import { React, ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import { Forms } from "@vendetta/ui/components";
import { showToast } from "@vendetta/ui/toasts";
import { BADGES, captureFromUserId } from "./index";

const { ScrollView } = ReactNative;
const { FormSection, FormRow, FormSwitch, FormInput, FormDivider } = Forms;

export default function Settings() {
    useProxy(storage);
    const [captureId, setCaptureId] = React.useState("");

    return (
        <ScrollView style={{ flex: 1 }}>
            <FormSection title="fake name (only u see btw)">
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

            <FormSection title="snag from user id">
                <FormInput
                    title="user id"
                    value={captureId}
                    placeholder="paste user id here..."
                    onChange={setCaptureId}
                />
                <FormRow
                    label="snag their badges"
                    onPress={() => {
                        if (!captureId || !/^\d{17,20}$/.test(captureId)) {
                            showToast("thats not a valid id lol", { type: 2 });
                            return;
                        }
                        captureFromUserId(captureId);
                    }}
                />
            </FormSection>

            <FormSection title="fake badges">
                {Object.keys(BADGES).map((key) => {
                    const badge = BADGES[key];
                    return (
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
                    );
                })}
            </FormSection>
        </ScrollView>
    );
}
