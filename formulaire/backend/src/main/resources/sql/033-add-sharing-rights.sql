INSERT INTO formulaire.form_shares (
    SELECT member_id, resource_id, 'fr-openent-formulaire-controllers-ResponseFileController|listByForm'
    FROM formulaire.form_shares
    WHERE action = 'fr-openent-formulaire-controllers-FormController|initResponderResourceRight'
) ON CONFLICT DO NOTHING;