package com.vietninie.service;

import com.vietninie.dto.request.PlacementSubmitRequest;
import com.vietninie.dto.response.PlacementQuestionResponse;
import com.vietninie.dto.response.PlacementResultResponse;
import com.vietninie.security.UserPrincipal;

import java.util.List;

public interface PlacementService {
    List<PlacementQuestionResponse> questions();

    /** @param principal may be null (anonymous) - the result is then not stored. */
    PlacementResultResponse submit(PlacementSubmitRequest request, UserPrincipal principal);
}
